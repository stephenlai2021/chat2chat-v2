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
import AddFriendModal from "../modal/AddFriendModal";
import CreateGroupModal from "../modal/CreateGroupModal";
import BrandTitle from "./BrandTitle";
// import LoadingSkeleton from "@/components/skeleton/LoadingSkeleton";

/* next-intl */
import { useTranslations } from "next-intl";

/* utils */
import { themes, languages } from "@/data/utils";
import { toast } from "react-hot-toast";
import { useFirebase } from "@/hooks/useFirebase";

/* next-themes */
import { useTheme } from "next-themes";

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
import { IoPersonAddOutline } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosPersonAdd } from "react-icons/io";
import { MdPersonAddAlt } from "react-icons/md";
import { BsPersonAdd } from "react-icons/bs";
import { GrGroup } from "react-icons/gr";
import { MdGroupAdd } from "react-icons/md";

function ChatList({ userData, setSelectedChatroom }) {
  const [activeTab, setActiveTab] = useState("privateChat");
  const [users, setUsers] = useState([]);
  const [userChatrooms, setUserChatrooms] = useState([]);
  const [userInfo, setUserInfo] = useState("");
  const [foundUsers, setFoundUsers] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [createChatLoading, setCreateChatLoading] = useState(false);
  const [chatListLoading, setChatListLoading] = useState(true);
  const [otherData, setOtherData] = useState({});
  const [foundUser, setFoundUser] = useState("");

  const { setTheme } = useTheme();
  const router = useRouter();
  const supabase = useSupabaseClient();

  const handleTabClick = (tab) => setActiveTab(tab);

  const searchUserByNameOrEmail = async () => {
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
    if (activeTab == "privateChat") {
      setUserInfo("");
      setFoundUsers("");
    }
  }, [activeTab]);

  /* 
    Donot delete this block !!! 
    get users once
  */
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

  /* 
    get chatrooms once
  */
  useEffect(() => {
    // Do not delete this line !!!
    if (!userData.id) return;

    // setChatListLoading(true);
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
      if (chatrooms.length !== 0) setChatListLoading(false);
      console.log("get chatrooms: ", chatrooms);
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

  const createChat = async (user, foundUsersLength) => {
    if (user.email === userData.email) {
      toast(`You cannot add yourself !`, { icon: "😅" });
      return;
    }
    setCreateChatLoading(true);

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
        if (foundUsersLength > 1) {
          console.log(
            `${user.name} with email: ${user.email} is already in your chat list`
          );
          toast(
            `${user.name} with email: ${user.email} is already in your chat list`,
            { icon: "😎" }
          );
        } else {
          console.log(`chatroom for ${user.name} is already existed`);
          toast(`${user.name} is already in your chat list`, { icon: "😎" });
        }

        setCreateChatLoading(false);
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

        // 以下是是新加的 field, 要注意既有的 chatrooms 都沒有, 所以讀取時會報錯 !!!
        newMessage: false,
        lastImage: null,
      };

      await addDoc(collection(firestore, "chatrooms"), chatroomData);
      setActiveTab("privateChat");
      setCreateChatLoading(false);
      // setFoundUser({ isClick: false, ...user });
      setUserInfo("");
      setFoundUsers("");
      document.getElementById("add-friend-modal").close();
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

    const tempData = data.otherData;
    setOtherData(tempData);
  };

  const logoutClick = async () => {
    /* set user status is optional, because it cost too much ! */
    // setUserStatusOffline()

    setLogoutLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("signout error: ", error);
      setLogoutLoading(false);
    } else {
      router.push("/login");
      setLogoutLoading(false);
    }
  };

  const resestAddFriendInfo = () => {
    setUserInfo("");
    setFoundUsers("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setChatListLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-full">
      <Sidebar
        userData={userData}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
        logoutClick={logoutClick}
        logoutLoading={logoutLoading}
      />

      {/* Main */}
      <div className="shadow-inner h-screen flex flex-col w-[300px] min-w-[200px] users-mobile">
        {/* Navbar */}
        <div className="navbar h-[60px] bg-base-30">
          <BrandTitle />

          {/* add-friend icon */}
          <BsPersonAdd
            className={`${
              activeTab == "privateChat" ? "navbar-show" : "hidden"
            } w-[23px] h-[23px] mr-2 hover:cursor-pointer text-base-content hidde navbar-sho`}
            onClick={() =>
              document.getElementById("add-friend-modal").showModal()
            }
          />

          {/* add-group icon */}
          <MdGroupAdd
            className={`${
              activeTab == "groupChat" ? "navbar-show" : "hidden"
            } w-[23px] h-[23px] mr-2 hover:cursor-pointer text-base-content hidde navbar-sho`}
            onClick={() =>
              document.getElementById("create-group-modal").showModal()
            }
          />

          {/* avatar-icon wrapper with drawer */}
          <div className="flex-none hidden navbar-show">
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
                        found={false}
                      />
                    </a>
                  </li>
                  {/* Menu list */}
                  <li>
                    <ul className="menu bg-base-200 w-ful rounded-box">
                      <div className="divider" />
                      {/* Theme */}
                      <li>
                        <details>
                          <summary className="">Theme</summary>
                          <ul>
                            {themes.map((theme) => (
                              <div
                                key={theme.label}
                                className="form-control"
                                onClick={() => setTheme(theme.value)}
                              >
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
                      {/* Language */}
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
                      <div className="divider" />
                      {/* Logout */}
                      <li>
                        <a onClick={logoutClick}>Logout</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section */}
        <div className="pt-1 overflow-y-auto h-full shadow-inner chatlist-mb-mobile">
          {/* {activeTab === "add" && (
            <>
              <div className="my-3 px-3 input-padding">
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
                        lastMessage={user.lastMessage}
                        found={true}
                      />
                      {createChatLoading ? (
                        <span className="loading loading-spinner loading-sm text-base-content absolute right-5 top-[50%] translate-y-[-50%]"></span>
                      ) : (
                        <IoPersonAddSharp
                          className="w-5 h-5 text-base-content absolute right-5 top-[50%] translate-y-[-50%] hover:cursor-pointer"
                          onClick={() => createChat(user)}
                        />
                      )}
                    </div>
                  ))}
              </div>
              {foundUsers.length > 1 &&
                foundUsers.length < foundUsers.length - 1 && (
                  <div className="divider" />
                )}
            </>
          )} */}

          {activeTab === "groupChat" && (
            <div className="h-full flex flex-col items-center justify-center">
              <h1>Group Chat</h1>
            </div>
          )}

          {/*
            1. 如果讀取到聊天室資料, 停止加載, 並立即渲染聊天室UI
            2. 過了 5 秒後加載圖標會自動停止, 如果有讀取到聊天室資料, 渲染聊天室UI, 反之不做任何渲染 
          */}
          {activeTab === "privateChat" && !chatListLoading && (
            <>
              {userChatrooms?.map((chatroom) => (
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
                    // email={
                    //   chatroom.usersData[
                    //     chatroom.users.find((id) => id !== userData?.id)
                    //   ].email
                    // }
                    newMessage={chatroom.newMessage}
                    lastImage={chatroom.lastImage}
                    lastMessage={chatroom.lastMessage}
                    lastMessageSentTime={chatroom.lastMessageSentTime}
                    loginUser={userData}
                    found={true}
                    otherData={otherData}
                  />
                </div>
              ))}
            </>
          )}

          {/* 組件載入後立刻顯示加載圖示 */}
          {activeTab === "privateChat" && chatListLoading && (
            <>
              {"abcd".split("").map((i) => (
                <UsersCardSkeleton key={i} />
              ))}
            </>
          )}

          {/* 
            經過 5 秒後停止加載圖標, 如果讀到的聊天室資料是空的, 印出 "您還沒有任何聊天室, 請加朋友聊天"
          */}
          {activeTab === "privateChat" &&
            userChatrooms.length === 0 &&
            !chatListLoading && (
              <div className="mt-10 px-3 flex flex-col items-center justify-center">
                <img
                  src="./begin_chat.svg"
                  alt=""
                  className="max-w-[300px] m-5"
                />
                {/* Add frined to begin chat ! */}
              </div>
            )}
        </div>

        <BottomNavbar
          userData={userData}
          activeTab={activeTab}
          handleTabClick={handleTabClick}
        />
      </div>

      {/* add-friend modal  */}
      <dialog id="add-friend-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost border-none absolute right-2 top-2"
              onClick={resestAddFriendInfo}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add friend</h3>

          {/* search input */}
          <div className="mt-3 input-paddin relative">
            <div
              className={`${
                userInfo ? "block" : "hidden"
              } absolute left-1 top-[50%] translate-y-[-50%] py-2 px-1`}
            >
              <IoCloseCircleOutline
                className={`w-[20px] h-[20px] hover:cursor-pointer 
                ${loading ? "text-neutral-content" : "text-base-content"}
                `}
                onClick={resetUserInfoAndFoundUsers}
              />
            </div>
            <input
              type="text"
              value={userInfo}
              onChange={(e) => setUserInfo(e.target.value)}
              onKeyDown={handleUserInfoKeyDown}
              placeholder="Enter name or email"
              className={`bg-base-300 rounded-md pr-8 py-3 w-full
                ${userInfo ? "pl-8" : "pl-4"}
                ${loading ? "text-neutral-content" : "text-base-content"}
              `}
              disabled={loading ? true : false}
            />
            <IoIosSearch
              className={`${
                userInfo && !loading ? "block" : "hidden"
              } w-[20px] h-[20px] hover:cursor-pointer text-base-content absolute right-[10px] top-[50%] translate-y-[-50%]`}
              onClick={searchUserByNameOrEmail}
            />
            <span
              className={`${
                loading ? "block text-neutral-content" : "hidden"
              } loading loading-spinner loading-sm text-base-conten absolute right-[10px] top-[50%] translate-y-[-50%]`}
            />
          </div>

          {/* search results */}
          <div className="relative mt-8 flex flex-col">
            {/* {loading && <UsersCardSkeleton />} */}

            {!loading &&
              foundUsers &&
              foundUsers.map((user) => (
                <>
                  <div
                    key={user.id}
                    className={`relative mb-[6px] shadow-md border- border-blue-30
                     ${createChatLoading ? "btn-disabled" : ""}
                    `}
                  >
                    <UsersCard
                      name={user.name}
                      avatarUrl={user.avatarUrl}
                      email={user.email}
                      lastMessage={user.lastMessage}
                      found={true}
                    />
                    <span
                      className={`${
                        createChatLoading ? "block" : "hidden"
                      } loading loading-spinner loading-sm text-base-content absolute right-3 top-0`}
                    />
                    <IoIosAddCircleOutline
                      className={`${
                        createChatLoading ? "hidden" : "block"
                      } w-6 h-6 text-base-content absolute right-3 top-0 hover:cursor-pointer`}
                      onClick={() => createChat(user, foundUsers.length)}
                    />
                  </div>
                </>
              ))}
          </div>
        </div>
      </dialog>

      {/* create-group-modal */}
      <dialog id="create-group-modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Create Group</h3>
          <p className="py-4">Please select your group members !</p>
        </div>
      </dialog>
    </div>
  );
}

export default ChatList;
