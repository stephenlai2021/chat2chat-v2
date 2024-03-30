/* react */
import { useState, useEffect, useRef } from "react";

/* next */
import Image from "next/image";
import backgroundImage from "../../public/avatar.png";

/* firebase */
import {
  doc,
  query,
  where,
  addDoc,
  getDoc,
  orderBy,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";

/* components */
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";
import MessageSkeleton from "@/components/skeleton/MessageSkeleton";
import AvatarImg from "@/components/images/avatar.png";

/* react-icons */
import { FaArrowLeft, FaBullseye } from "react-icons/fa";

import UserAvatar from "@/components/images/avatar.png";

export default function ChatRoom({ selectedChatroom, setSelectedChatroom }) {
  const me = selectedChatroom?.myData;
  const other = selectedChatroom?.otherData;
  const chatRoomId = selectedChatroom?.id;

  const messagesContainerRef = useRef(null);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [otherUserData, setOtherUserData] = useState(null);

  const [msgCount, setMsgCount] = useState(0);
  const [isMessageBottom, setIsMessageBottom] = useState(false);

  const gotoUsersMenu = () => setSelectedChatroom(null);

  const deleteMsg = async (id) => {
    try {
      await deleteDoc(doc(firestore, "messages", id));

      /* updateDoc triggers snapshot twice which is a bug !!! */
      const chatroomRef = doc(firestore, "chatrooms", chatRoomId);
      await updateDoc(chatroomRef, {
        lastMessage: 'message withdrawn',
        lastMessageSentTime: serverTimestamp(),
      });
    } catch (err) {
      console.log("error: ", err);
    }
  };

  /* 
    put messages in db 
    This function triggers realtime snapshot (messages && chatrooms) twice !!!
  */
  const sendMessage = async () => {
    if (message == "" && image == null) return;
    try {
      let newMessage = {
        chatRoomId,
        sender: me.id,
        content: message,
        time: serverTimestamp(),
        image,
      };

      /*
          Clear the input field before sending the message
          This is important to clear input field in here !!!
        */
      setMessage("");
      setImage(null);

      // add new message in messages collection
      const messagesCollection = collection(firestore, "messages");
      await addDoc(messagesCollection, newMessage);

      /* update last message in chatrooms collection */
      const chatroomRef = doc(firestore, "chatrooms", chatRoomId);
      await updateDoc(chatroomRef, {
        lastImage: image ? image : "",
        lastMessage: message ? message : "",
        lastMessageSentTime: serverTimestamp(),
        // [`usersData.${otherUserData.id}.newMessage`]: otherUserData.newMessage + 1
      });
    } catch (error) {
      console.error("Error sending message:", error.message);
    }

    // Scroll to the bottom after sending a message
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  /*
    Auto scroll to the bottom of the messages container after
    click user card component.
    Not working at the first loading !!!
  */
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messagesContainerRef, messages, loading]);

  /* 
  handle chat bubble loading time 
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [loading]);

  /* 
    get messages 
  */
  useEffect(() => {
    // Do not delete this line !!!
    if (!chatRoomId) return;

    setLoading(true);
    const unsubMsgs = onSnapshot(
      query(
        collection(firestore, "messages"),
        where("chatRoomId", "==", chatRoomId),
        orderBy("time", "asc")
      ),
      (snapshot) => {
        setMessages([]);
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages);
        if (messages.length !== 0) setLoading(false);
        console.log("get messages: ", messages);
      }
    );
    return () => unsubMsgs();
  }, [chatRoomId]);

  /*
    Scroll to the bottom when messages change
  */
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  /* get other user in realtime */
  useEffect(() => {
    const unsubOtherUser = onSnapshot(
      doc(firestore, "users", other.email),
      (doc) => {
        setOtherUser(doc.data());
      }
    );
    return () => unsubOtherUser();
  }, [other]);

  /* 
    Do not delete this block !!!
    Get other user data
    We need realtime other user data to set the message count,
    This is optional, because it increases the cost !!!
  */
  // useEffect(() => {
  //   const unsub = onSnapshot(doc(firestore, "chatrooms", chatRoomId), (doc) => {
  //     const selectedChatroom = doc.data();
  //     console.log("get selected chatroom | ChatRoom: ", selectedChatroom);

  //     const otherUserData =
  //       selectedChatroom.usersData[
  //         selectedChatroom.users.find((id) => id !== me.id)
  //       ];
  //     console.log("other user data: ", otherUserData);
  //     setOtherUserData(otherUserData);
  //   });
  //   return () => unsub();
  // }, [chatRoomId]);

  return (
    <div className="flex flex-col h-screen shadow-inner">
      {/* top menu */}
      <div className="h-[64px] flex items-center shadow-inner bg-base-30">
        {loading ? (
          <div className="hidde show-fle flex">
            <div className="flex items-end ml-4 pb-1 hidden show-flex">
              <div className="skeleton rounded w-[18px] h-[18px] pt-"></div>
            </div>
            <div className="skeleton rounded-full w-9 h-9 ml-4 navbar-avatar-margin"></div>
            <div className="flex items-end pb-1 border-1 ml-2">
              <div className="skeleton rounded w-[72px] h-4"></div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`${
                selectedChatroom ? "arrow-show" : "hidden"
              } border- hidden ml-4 pr-1 flex pt-3 hover:cursor-pointer`}
              onClick={gotoUsersMenu}
            >
              <FaArrowLeft className="text-base-content w-[18px] h-[18px]" />
            </div>

            <div className="border- border-base-content avatar avatar-margin-mobile avatar-margin-desktop relative">
              <div className="w-9 h-9 rounded-full bg-[url('/avatar.png')]">
                {otherUser?.avatarUrl ? (
                  <img src={otherUser?.avatarUrl} />
                ) : (
                  <img src="/avatar.png" />
                )}
              </div>
            </div>
            <div className="h-8 font-semibold flex items-end ml-2 text-base-content">
              {otherUser?.name}
            </div>
          </>
        )}
      </div>
      <div
        ref={messagesContainerRef}
        className="shadow-inner flex-1 overflow-auto py-5 px-3"
      >
        {!loading &&
          messages?.map((message, index) => (
            <MessageCard
              me={me}
              index={index}
              key={message.id}
              message={message}
              other={otherUser}
              deleteMsg={deleteMsg}
            />
          ))}

        {loading && <MessageSkeleton />}
      </div>

      <MessageInput
        image={image}
        message={message}
        setImage={setImage}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />

      {/* <MessageInput
        me={me}
        chatRoomId={chatRoomId}
        selectedChatroom={selectedChatroom}
      /> */}
    </div>
  );
}

