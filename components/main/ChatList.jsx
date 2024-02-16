"use client";

/* react */
import { useEffect, useState, useContext } from "react";

/* firebase */
import { firestore, auth } from "@/lib/firebase/client";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  updateDoc,
  serverTimestamp,
  doc,
  where,
  or,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

/* next */
import { useRouter } from "next/navigation";

/* supabase */
import useSupabaseClient from "@/lib/supabase/client";

/* components */
import UsersCard from "./UsersCard";
import Sidebar from "./Sidebar";
import BottomNavbar from "./BottomNavbar";
import MainNavbar from "./Navbar";
import UsersCardSkeleton from "../skeleton/UsersCardSkeleton";
// import LoadingSkeleton from "@/components/skeleton/LoadingSkeleton";

/* next-intl */
import { useTranslations } from 'next-intl';

/* utils */
import { themes, languages } from "@/data/utils";
import { toast } from "react-hot-toast";
import { useFirebase } from "@/hooks/useFirebase";

/* react-icons */
import { IoIosSend } from "react-icons/io";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { IoMdAddCircle } from "react-icons/io";
import { IoMdChatboxes } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { RiUserAddLine } from "react-icons/ri";
import { IoIosSearch } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";

function ChatList({ userData, selectedChatroom, setSelectedChatroom }) {
  // console.log('user data | chat list: ', userData)

  const [activeTab, setActiveTab] = useState("privateChat");
  const [users, setUsers] = useState([]);
  const [userChatrooms, setUserChatrooms] = useState([]);
  const [userInfo, setUserInfo] = useState("");
  const [foundUsers, setFoundUsers] = useState("");
  const [loading, setLoading] = useState(false);
  const [otherData, setOtherData] = useState({})

  const router = useRouter();

  const supabase = useSupabaseClient();

  // const t = useTranslations('ChatList');

  const handleTabClick = (tab) => setActiveTab(tab);

  const searchUserByNameOrEmail = async () => {
    // if (!userInfo) return;
    console.log("user info: ", userInfo);

    setLoading(true);
    const q = query(
      collection(firestore, "users"),
      or(where("name", "==", userInfo), where("email", "==", userInfo))
    );
    const users = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    setFoundUsers(users);
    setLoading(false);

    if (users.length === 0) {
      toast("This user is not existed !", { icon: "🤔" });
    }
  };

  const handleUserInfo = (val) => {
    setUserInfo(val);
    setFoundUsers("");
  };

  const handleUserInfoKeyDown = (event) => {
    if (event.key === "Enter") searchUserByNameOrEmail();
  };

  const resetUserInfoAndFoundUsers = () => {
    setUserInfo("");
    setFoundUsers("");
  };

  /* reset user info if switch to chatrooms menu */
  useEffect(() => {
    if (activeTab == "chatrooms") {
      setUserInfo("");
      setFoundUsers("");
    }
  }, [activeTab]);

  /* get users */
  // useEffect(() => {
  //   const usersRef = collection(firestore, "users");
  //   const unsubUsers = onSnapshot(usersRef, (snapshot) => {
  //     const users = [];
  //     snapshot.forEach((doc) => users.push(doc.data()));
  //     setUsers(users);
  //     console.log("get users | chat list: ", users);
  //   });
  //   return () => unsubUsers();
  // }, []);

  /* get chatrooms */
  useEffect(() => {
    // Do not delete this line !!!
    if (!userData.id) return;

    const chatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", userData.id)
    );
    const unsubChatrooms = onSnapshot(chatroomsQuery, (snapshot) => {
      const chatrooms = [];
      snapshot.forEach((doc) => {
        chatrooms.push({ id: doc.id, ...doc.data() });
      });
      setUserChatrooms(chatrooms);
      console.log("get chatrooms | chat list: ", chatrooms);
    });
    return () => unsubChatrooms();
  }, [userData]);

  /* 
    This function reads through chatrooms collection, 
    finding out documents containing login user data, 
    then set status 'offline'  
    if you have 100 chat lists it will read 50 times and
    get realtime db 50 times which cost too much, so there
    is no need to add online/offline status in chat app
  */
  const setUserStatusOffline = async () => {
    const loginUserRef = doc(firestore, "users", userData.email);
    await updateDoc(loginUserRef, { status: "offline" });

    const chatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", userData.id)
    );
    const querySnapshot = await getDocs(chatroomsQuery);
    querySnapshot.forEach(async (document) => {
      console.log(document.id, document.data());
      await updateDoc(doc(firestore, "chatrooms", document.id), {
        [`usersData.${userData.id}.status`]: "offline",
      });
    });
  };

  const createChat = async (user) => {
    if (user.email === userData.email) {
      toast(`You cannot add yourself !`, { icon: "😅" });
      return;
    }

    // 檢查聊天室是否存在
    const existingChatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "in", [
        [userData.id, user.id],
        [user.id, userData.id],
      ])
    );

    try {
      const existingChatroomsSnapshot = await getDocs(existingChatroomsQuery);

      if (existingChatroomsSnapshot.docs.length > 0) {
        console.log(`chatroom for ${user.name} is already existed`);
        toast(`${user.name} is already in your chat list`, { icon: "😎" });
        return;
      }

      const usersData = {
        [userData.id]: userData,
        [user.id]: user,
      };

      const chatroomData = {
        users: [userData.id, user.id],
        usersData,
        timestamp: serverTimestamp(),
        lastMessage: null,
        lastMessageSentTime: null,
      };

      await addDoc(collection(firestore, "chatrooms"), chatroomData);
      setActiveTab("chatrooms");
      // setUserByEmail("");
    } catch (error) {
      console.error("Error creating or checking chatroom:", error);
    }
  };

  const openChat = async (chatroom) => {
    const data = {
      id: chatroom.id,
      myData: userData,
      otherData:
        chatroom.usersData[chatroom.users.find((id) => id !== userData.id)],
    };
    setSelectedChatroom(data);
    
    const tempData = data.otherData
    setOtherData(tempData)
  };

  const logoutClick = async () => {
    /* set user status is optional, because it cost too much ! */
    // setUserStatusOffline()

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("signout error: ", error);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar
        userData={userData}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        logoutClick={logoutClick}
      />

      <div className="shadow-inner h-screen flex flex-col w-[300px] min-w-[200px] users-mobile">
        {/* Navbar */}
        <div className="navbar h-[60px] bg-base-30">
          <div className="flex-1">
            <div className="text-xl font-bold text-base-content pl-3">
              {activeTab == "privateChat"
                ? "Private Chat"
                // ? "Chatrooms"
                // ? t('chatrooms')
                : activeTab == "groupChat"
                ? "Group Chat"
                : activeTab == "add"
                ? "Add friend"
                // ? t('add')
                // : activeTab == "settings"
                // ? "Settings"
                // : activeTab == "user"
                // ? "Profile"
                : ""}
            </div>
          </div>

          <div className="flex-none hidden navbar-show">
            {/* avatar icon */}
            <div className="drawer z-[200]">
              <input
                id="navbar-drawer-settings"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="flex justify-center">
                <label
                  htmlFor="navbar-drawer-settings"
                  aria-label="close sidebar"
                  className="px-3 py-2"
                >
                  <RxAvatar className="w-[24px] h-[24px] hover:cursor-pointer text-base-content" />
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="navbar-drawer-settings"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="pt-4 w-80 min-h-full bg-base-200 text-base-content">
                  <li className="pl-2">
                    <a>
                      <UsersCard
                        name={userData.name}
                        email={userData.email}
                        avatarUrl={userData.avatarUrl}
                      />
                    </a>
                  </li>
                  <li>
                    {/* <a> */}
                    <ul className="menu bg-base-200 w-ful rounded-box">
                      <li>
                        <details>
                          <summary className="">Theme</summary>
                          <ul>
                            {themes.map((theme) => (
                              <div key={theme.label} className="form-control">
                                <label className="label cursor-pointer gap-4">
                                  <span className="label-text">
                                    {theme.label}
                                  </span>
                                  <input
                                    type="radio"
                                    name="theme-radios"
                                    className="radio theme-controller"
                                    value={theme.value}
                                  />
                                </label>
                              </div>
                            ))}
                          </ul>
                        </details>
                      </li>
                      <li>
                        <details>
                          <summary>Language</summary>
                          <ul>
                            {languages.map((language) => (
                              <li key={language.label}>
                                <a>{language.value}</a>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                      <li>
                        <a onClick={logoutClick}>Logout</a>
                      </li>
                    </ul>
                    {/* </a> */}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-1 overflow-y-auto h-full shadow-inner">
          {activeTab === "add" && (
            <>
              {/* search friend by name or email */}
              <div className="my-3 px-3 input-padding">
                <div className="label">
                  <span className="label-text">Find your friend</span>
                </div>

                <div className="relative">
                  {userInfo && (
                    <div className="border- absolute left-1 top-[50%] translate-y-[-50%] py-2 px-1">
                      <IoCloseCircleOutline
                        className="w-[20px] h-[20px] hover:cursor-pointer text-base-content"
                        onClick={resetUserInfoAndFoundUsers}
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={userInfo}
                    onChange={(e) => setUserInfo(e.target.value)}
                    onKeyDown={handleUserInfoKeyDown}
                    placeholder="Enter name or email"
                    className={`bg-base-100 rounded-md input-m ${
                      userInfo ? "pl-8" : "pl-4"
                    } pr-8 py-3 w-full max-w-x text-base-content`}
                  />
                  {userInfo && (
                    <div className="border- absolute right-1 top-[50%] translate-y-[-50%] py-2 px-1">
                      <IoIosSearch
                        className="w-[20px] h-[20px] hover:cursor-pointer text-base-content"
                        onClick={searchUserByNameOrEmail}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* users found by name or email  */}
              <div className="relative mt-8 flex flex-col">
                {loading && <UsersCardSkeleton />}

                {!loading &&
                  foundUsers &&
                  foundUsers.map((user) => (
                    <div key={user.id} className="relative mb-2">
                      <UsersCard
                        name={user.name}
                        avatarUrl={user.avatarUrl}
                        email={user.email}
                        status={user.status}
                        lastMessage={user.lastMessage}
                        found={"true"}
                      />
                      <IoPersonAddSharp
                        className="w-5 h-5 text-base-content absolute right-5 top-4 hover:cursor-pointer"
                        onClick={() => createChat(user)}
                      />
                    </div>
                  ))}
              </div>
            </>
          )}
          {activeTab === "privateChat" && userChatrooms.length !== 0 && (
            <>
              {userChatrooms.map((chatroom) => (
                <div
                  key={chatroom.id}
                  onClick={() => {
                    openChat(chatroom);
                  }}
                >
                  <UsersCard
                    key={chatroom.id}
                    name={
                      chatroom.usersData[
                        chatroom.users.find((id) => id !== userData?.id)
                      ].name
                    }
                    avatarUrl={
                      chatroom.usersData[
                        chatroom.users.find((id) => id !== userData?.id)
                      ].avatarUrl
                    }
                    email={
                      chatroom.usersData[
                        chatroom.users.find((id) => id !== userData?.id)
                      ].email
                    }
                    status={
                      chatroom.usersData[
                        chatroom.users.find((id) => id !== userData?.id)
                      ].status
                    }
                    lastMessage={chatroom.lastMessage}
                    lastMessageSentTime={chatroom.lastMessageSentTime}
                    timeStamp={chatroom.timestamp}
                    loginUser={userData}
                    found={"false"}
                    otherData={otherData}
                  />
                </div>
              ))}
            </>
          )}
          {activeTab === "privateChat" && userChatrooms.length === 0 && (
            <>
              {"abcd".split("").map((i) => (
                <UsersCardSkeleton key={i} />
              ))}
            </>
          )}
        </div>

        <BottomNavbar
          userData={userData}
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
      </div>
    </div>
  );
}

export default ChatList;
