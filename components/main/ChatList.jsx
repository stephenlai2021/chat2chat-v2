"use client";

/* react */
import { useEffect, useState, useRef } from "react";

/* firebase */
import { firestore } from "@/lib/firebase/client";
import { collection, onSnapshot, query, where } from "firebase/firestore";

/* next */
import { useRouter } from "next/navigation";

/* supabase */
import useSupabaseClient from "@/lib/supabase/client";

/* utils */
import { languages } from "@/data/utils";

/* components */
import Sidebar from "./Sidebar";
import UsersCard from "./UsersCard";
import BrandTitle from "./BrandTitle";
import BottomNavbar from "./BottomNavbar";
import AddFriendModal from "../modal/AddFriendModal";
import ThemeSwitcher from "../switcher/ThemeSwitcher";
import CreateGroupModal from "../modal/CreateGroupModal";
import UsersCardSkeleton from "../skeleton/UsersCardSkeleton";

/* react-icons */
import { RxAvatar } from "react-icons/rx";
import { IoIosSearch } from "react-icons/io";
import { GoPlusCircle } from "react-icons/go";
import { IoCloseCircleOutline } from "react-icons/io5";

/* hooks */
import useWindowSize from "@/hooks/useWindowSize";

function ChatList({ userData, setSelectedChatroom }) {
  const [otherData, setOtherData] = useState({});
  const [isSearch, setIsSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userChatrooms, setUserChatrooms] = useState([]);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [chatListLoading, setChatListLoading] = useState(true);
  const [filteredChatrooms, setFilteredChatrooms] = useState([]);

  const router = useRouter();
  const size = useWindowSize();
  const searchTermRef = useRef(null);
  const supabase = useSupabaseClient();

  useEffect(() => {
    if (searchTermRef.current) searchTermRef.current.focus();
  }, [searchTerm]);

  /* get chatrooms once */
  useEffect(() => {
    if (!userData?.id) return;

    const chatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", userData?.id)
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
  // }, []);

  const openChat = async (chatroom) => {
    const data = {
      id: chatroom.id,
      myData: userData,
      otherData:
        chatroom.usersData[chatroom.users.find((id) => id !== userData.id)],
    };
    setSelectedChatroom(data);

    // const tempData = data.otherData;
    // setOtherData(tempData);
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

          <div
            className={`dropdown dropdown-bottom dropdown-end ${
              size.width > 800 ? "hidden" : "block"
            }`}
          >
            <div tabIndex={0} role="button" className="mx-[6px]">
              <GoPlusCircle className="w-[22px] h-[22px] hover:cursor-pointer text-base-content" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
            >
              <li>
                <a
                  onClick={() =>
                    document.getElementById("addFriendModalNavbar").showModal()
                  }
                >
                  Add Friend
                </a>
              </li>
              <li>
                <a className="opacity-30 disabled">Create Group</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Body */}
        <div
          className="overflow-y-auto overflow-x
        
        -hidden h-full shadow-inner"
        >
          {/* search input */}
          <div
            className={`relative flex justify-center mx-3
            ${isSearch ? "my-3" : "my-1"}
          `}
          >
            <input
              type="text"
              value={searchTerm}
              autoFocus
              onFocus={(e) => e.currentTarget.select()}
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

          {/*
            1. 如果讀取到聊天室資料, 停止加載, 並立即渲染聊天室UI
            2. 過了 5 秒後加載圖標會自動停止, 如果有讀取到聊天室資料, 渲染聊天室UI, 反之不做任何渲染 
          */}
          {!chatListLoading && (
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
          {chatListLoading && (
            <div className="py-3">
              {"abcd".split("").map((i) => (
                <UsersCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* 
            經過 5 秒後停止加載圖標, 如果讀到的聊天室資料是空的, 印出 "您還沒有任何聊天室, 請加朋友聊天"
          */}
          {userChatrooms.length === 0 && !chatListLoading && (
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
          logoutClick={logoutClick}
          logoutLoading={logoutLoading}
        />
      </main>

      <CreateGroupModal id="createGroupModal" />
      <AddFriendModal id="addFriendModalNavbar" userData={userData} />
    </div>
  );
}

export default ChatList;
