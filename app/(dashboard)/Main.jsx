"use client";

/* react */
import { useEffect, useState } from "react";

/* firebase */
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";

/* supabase */
import { createBrowserClient } from '@supabase/ssr'
import getUserSession from "@/lib/supabase/getUserSession";

/* components */
import ChatList from "@/components/main/ChatList";
import ChatRoom from "../../components/chatroom/ChatRoom";
import LoadingSkeleton from '@/components/skeleton/LoadingSkeleton'

// export default function Main({userData}) {
export default function Main() {
  // const [user, setUser] = useState({});
  const [userCred, setUserCred] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // const getLoginUserData = async () => {
  //   const docRef = doc(firestore, "users", userCred.email);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     const data = docSnap.data();
  //     setUser(data);
  //   } else {
  //     console.log("Cannot find this user !");
  //   }
  // };

  const getUserData = async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) console.log('Error getting userCred')
    if (data) setUserCred(data?.user)
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    console.log("userData: ", userData);
  }, [userData]);

  useEffect(() => {
    if (!userCred) return;
    console.log("userCred: ", userCred);

    const unsubUser = onSnapshot(
      doc(firestore, "users", userCred?.email),
      (doc) => {
        console.log("userData: ", doc.data());
        setUserData(doc.data());
      }
    );
    return () => unsubUser();
  }, [userCred]);

  if (userData) {
    return (
      <div className="flex h-screen">
        <div
          className={`relative ${
            selectedChatroom == null ? "users-mobile" : "users-hide"
          }`}
        >
          <ChatList
            userData={userData}
            setSelectedChatroom={setSelectedChatroom}
          />
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
          </div>
        )}
      </div>
    );
  }
  return <LoadingSkeleton />
}
