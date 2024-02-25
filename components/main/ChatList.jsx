"use client";

/* react */
import { useEffect, useState, useRef } from "react";

/* firebase */
import { firestore } from "@/lib/firebase/client";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  // addDoc,
  // updateDoc,
  // serverTimestamp,
  // doc,
  // or,
  // getDocs,
  // getDoc,
} from "firebase/firestore";
// import { signOut } from "firebase/auth";

/* next */
import { useRouter } from "next/navigation";

/* supabase */
import useSupabaseClient from "@/lib/supabase/client";

/* utils */
import { languages } from "@/data/utils";

/* components */
import UsersCard from "./UsersCard";
import Sidebar from "./Sidebar";
import BottomNavbar from "./BottomNavbar";
import UsersCardSkeleton from "../skeleton/UsersCardSkeleton";
import AddFriendModal from "../modal/AddFriendModal";
import CreateGroupModal from "../modal/CreateGroupModal";
import BrandTitle from "./BrandTitle";
import ThemeSwitcher from "../switcher/ThemeSwitcher";

/* react-icons */
import { BsPersonAdd } from "react-icons/bs";
import { MdGroupAdd } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";

function ChatList({ userData, setSelectedChatroom }) {
  const [activeTab, setActiveTab] = useState("privateChat");
  const [otherData, setOtherData] = useState({});
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [chatListLoading, setChatListLoading] = useState(true);
  const [isSearch, setIsSearch] = useState(false);
  const [userChatrooms, setUserChatrooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChatrooms, setFilteredChatrooms] = useState([]);
  // const [users, setUsers] = useState([]);

  const router = useRouter();
  const searchTermRef = useRef(null)
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (searchTermRef.current) searchTermRef.current.focus()
  }, [searchTerm])

  const handleTabClick = (tab) => setActiveTab(tab);

  /* 
    Donot delete this effect !!! 
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
      // orderBy("timestamp", "asc")
    );
    const unsubChatrooms = onSnapshot(chatroomsQuery, (snapshot) => {
      const chatrooms = [];
      snapshot.forEach((doc) => {
        chatrooms.push({ id: doc.id, ...doc.data() });
      });
      setUserChatrooms(chatrooms);
      setFilteredChatrooms(chatrooms);
      if (chatrooms.length !== 0) setChatListLoading(false);
      console.log("get chatrooms: ", chatrooms);
    });
    return () => unsubChatrooms();
  }, [userData]);

  /* 
    Do not delete this function !!!
    This function reads through chatrooms collection, 
    finding out documents containing login user data, 
    then set status 'offline'  
    if you have 100 chat lists it will read 50 times and
    get realtime db 50 times which cost too much, so there
    is no need to add online/offline status in chat app
  */
  // const setUserStatusOffline = async () => {
  //   const loginUserRef = doc(firestore, "users", userData.email);
  //   await updateDoc(loginUserRef, { status: "offline" });

  //   const chatroomsQuery = query(
  //     collection(firestore, "chatrooms"),
  //     where("users", "array-contains", userData.id)
  //   );
  //   const querySnapshot = await getDocs(chatroomsQuery);
  //   querySnapshot.forEach(async (document) => {
  //     console.log(document.id, document.data());
  //     await updateDoc(doc(firestore, "chatrooms", document.id), {
  //       [`usersData.${userData.id}.status`]: "offline",
  //     });
  //   });
  // };

  // const createChat = async (user, foundUsersLength) => {
  //   if (user.email === userData.email) {
  //     toast(`You cannot add yourself !`, { icon: "😅" });
  //     return;
  //   }
  //   setCreateChatLoading(true);

  //   // 檢查聊天室是否存在
  //   const existingChatroomsQuery = query(
  //     collection(firestore, "chatrooms"),
  //     where("users", "in", [
  //       [userData.id, user.id],
  //       [user.id, userData.id],
  //     ])
  //   );

  //   try {
  //     const existingChatroomsSnapshot = await getDocs(existingChatroomsQuery);

  //     if (existingChatroomsSnapshot.docs.length > 0) {
  //       if (foundUsersLength > 1) {
  //         console.log(
  //           `${user.name} with email: ${user.email} is already in your chat list`
  //         );
  //         toast(
  //           `${user.name} with email: ${user.email} is already in your chat list`,
  //           { icon: "😎" }
  //         );
  //       } else {
  //         console.log(`chatroom for ${user.name} is already existed`);
  //         toast(`${user.name} is already in your chat list`, { icon: "😎" });
  //       }

  //       setCreateChatLoading(false);
  //       return;
  //     }

  //     const usersData = {
  //       [userData.id]: userData,
  //       [user.id]: user,
  //     };

  //     const chatroomData = {
  //       users: [userData.id, user.id],
  //       usersData,
  //       timestamp: serverTimestamp(),
  //       lastMessage: null,
  //       lastMessageSentTime: null,

  //       // 以下是是新加的 field, 要注意既有的 chatrooms 都沒有, 所以讀取時會報錯 !!!
  //       newMessage: false,
  //       lastImage: null,
  //     };

  //     await addDoc(collection(firestore, "chatrooms"), chatroomData);
  //     setActiveTab("privateChat");
  //     setCreateChatLoading(false);
  //     // setFoundUser({ isClick: false, ...user });
  //     setUserInfo("");
  //     setFoundUsers("");
  //     document.getElementById("add-friend-modal").close();
  //   } catch (error) {
  //     console.error("Error creating or checking chatroom:", error);
  //   }
  // };

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

  const handleInputChange = (e) => {
    const searchItem = e.target.value;
    setSearchTerm(searchItem);

    const filterdItem = userChatrooms.filter((chatroom) => {
      return chatroom.usersData[
        chatroom.users.find((id) => id !== userData?.id)
      ].name
        .toLowerCase()
        .includes(searchItem.toLowerCase());
    });
    setFilteredChatrooms(filterdItem);
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

      <main className="shadow-inner h-screen flex flex-col w-[300px] min-w-[200px] users-mobile">
        {/* Navbar */}
        <div className="navbar h-[60px] bg-base-30">
          <BrandTitle />

          {/* search icon */}
          <div className="relative">
            <IoIosSearch
              className={`
                w-[23px] h-[23px] mx-2 hover:cursor-pointer text-base-content hidde navbar-sho
                ${isSearch ? "hidden" : "block"}
              `}
              onClick={() => setIsSearch((current) => !current)}
            />
          </div>

          {/* add-friend icon */}
          <BsPersonAdd
            className={`${
              activeTab == "privateChat" ? "navbar-show" : "hidden"
            } w-[23px] h-[23px] mx-2 hover:cursor-pointer text-base-content hidde navbar-sho`}
            onClick={() =>
              document.getElementById("addFriendModal").showModal()
            }
          />

          {/* add-group icon */}
          <MdGroupAdd
            className={`${
              activeTab == "groupChat" ? "navbar-show" : "hidden"
            } w-[23px] h-[23px] mx-2 hover:cursor-pointer text-base-content hidde navbar-sho`}
            onClick={() =>
              document.getElementById("createGroupModal").showModal()
            }
          />

          {/* avatar-icon with drawer wrapper */}
          <div className="flex-none hidde navbar-sho">
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
                  className="mx-2 py-2"
                >
                  {/* <RxAvatar className="w-[24px] h-[24px] hover:cursor-pointer text-base-content" /> */}
                  <IoSettingsOutline className="w-[24px] h-[24px] hover:cursor-pointer text-base-content" />
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="navbar-drawer-settings"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="pt-4 w-80 min-h-full bg-base-200 text-base-content">
                  {/* User Info */}
                  <li className="pl-2 hidden mobile-show">
                    <a>
                      <UsersCard
                        name={userData.name}
                        email={userData.email}
                        avatarUrl={userData.avatarUrl}
                        found={false}
                      />
                    </a>
                    <div className="divider" />
                  </li>
                  <li>
                    <ul className="menu bg-base-200 w-ful rounded-box">
                      <li>
                        <details>
                          <summary className="">Theme</summary>
                          <ThemeSwitcher />
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
                      <div className="divider" />
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

        {/* Body */}
        <div className="overflow-y-auto overflow-x-hidden h-full shadow-inner chatlist-mb-mobile">
          {/* search input */}
          <div 
            className={`relative flex justify-center mx-3
            ${isSearch ? 'my-3' : 'my-1'}
          `}>
            <input
              type="text"
              value={searchTerm}
              // autoFocus
              onFocus={e => e.currentTarget.select()}
              onChange={handleInputChange}
              placeholder="Enter name"
              className={`px-3 bg-base-300 py-3 rounded-xl w-full outline-none 
              ${isSearch ? "block" : "hidden"}
              `}
            />
            <IoCloseCircleOutline
              className={`
                w-[22px] h-[22px] absolute top-[50%] translate-y-[-50%] right-3 hover:cursor-pointer
                ${!searchTerm && isSearch ? "block" : "hidden"}
                `}
              onClick={() => setIsSearch(false)}
            />
          </div>

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
              {filteredChatrooms?.map((chatroom) => (
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
            <div className="py-3">
              {"abcd".split("").map((i) => (
                <UsersCardSkeleton key={i} />
              ))}
            </div>
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
                  className="max-w-[100px] m-5"
                />
                {/* Add frined to begin chat ! */}
              </div>
            )}
        </div>

        <BottomNavbar
          userData={userData}
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          logoutClick={logoutClick}
        />
      </main>

      <AddFriendModal
        id="addFriendModal"
        userData={userData}
        setActiveTab={setActiveTab}
      />

      <CreateGroupModal id="createGroupModal" />
    </div>
  );
}

export default ChatList;
