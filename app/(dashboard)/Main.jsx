"use client";

/* react */
import { useEffect, useState } from "react";

/* firebase */
import { firestore } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

/* components */
import ChatList from "@/components/main/ChatList";
import ChatRoom from "../../components/chatroom/ChatRoom";

// function Main({ userCred }) {
function Main({ data }) {
  const [user, setUser] = useState({});
  const [selectedChatroom, setSelectedChatroom] = useState(null);

  const getLoginUserData = async () => {
    const docRef = doc(firestore, "users", userCred.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setUser(data);
    } else {
      console.log("Cannot find this user !");
    }
  };

  // useEffect(() => {
  //   getLoginUserData();
  // }, [userCred]);

  return (
    <div className="flex h-screen">
      <div
        className={`relative ${
          selectedChatroom == null ? "users-mobile" : "users-hide"
        }`}
      >
        <ChatList userData={data} setSelectedChatroom={setSelectedChatroom} />
      </div>

      {selectedChatroom && (
        <div
          className={`w-9/12 ${
            selectedChatroom ? "chatroom-mobile" : "chatroom-hide"
          }`}
        >
          <ChatRoom
            selectedChatroom={selectedChatroom}
            setSelectedChatroom={setSelectedChatroom}
          />
        </div>
      )}

      {selectedChatroom == null && (
        <div
          className={`${
            selectedChatroom == null ? "chatroom-hide" : "chatroom-mobile"
          } shadow-inner w-9/12 flex flex-col items-center justify-center h-full chatroom-none`}
        >
          <img
            src="./undraw_chat_mobile-removebg.png"
            alt="cha illustration"
            className="max-w-[300px]"
          />
          {/* <div className="text-3xl text-base-content italic">Chat2Chat</div> */}
        </div>
      )}
    </div>
  );
}

export default Main;
