"use client";

/* react */
import { useEffect, useState } from "react";

/* clerk */
import { useAuth, useUser } from "@clerk/nextjs";

/* firebase */
import {
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  collection,
  setDoc,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/client";

/* supabase */
import { createBrowserClient } from "@supabase/ssr";
import getUserSession from "@/lib/supabase/getUserSession";

/* components */
import ChatList from "@/components/main/ChatList";
import ChatRoom from "../../components/chatroom/ChatRoom";
import LoadingSkeleton from "@/components/skeleton/LoadingSkeleton";
import AddFriendModal from "@/components/modal/AddFriendModal";

/* lucide-react */
import { UserPlusIcon } from "lucide-react";

export default function Main() {
  const [userCred, setUserCred] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedChatroom, setSelectedChatroom] = useState(null);

  const { isLoaded, isSignedIn, user } = useUser();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

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

  /* supabase */
  // useEffect(() => {
  //   const getUserData = async () => {
  //     const { data, error } = await supabase.auth.getUser();
  //     if (error || !data?.user) console.log("Error getting userCred");
  //     if (data) setUserCred(data?.user);
  //   };
  //   getUserData();
  // }, []);

  /* clerk */
  useEffect(() => {
    if (!user) return;
    console.log(user);

    // search db for signup user, if not found, create one
    const checkIfUseremailExist = async () => {
      const usersRef = collection(firestore, "users");
      const q = query(
        usersRef,
        where("email", "==", user.emailAddresses[0].emailAddress)
      );
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot);
      if (querySnapshot.docs.length == 0) {
        const userEmailRef = doc(
          firestore,
          "users",
          user.emailAddresses[0].emailAddress
        );
        await setDoc(userEmailRef, {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
        });
      }
    };

    checkIfUseremailExist();
    const unsubUser = onSnapshot(
      doc(firestore, "users", user.emailAddresses[0].emailAddress),
      (doc) => {
        console.log("userData: ", doc.data());
        setUserData(doc.data());
      }
    );
    return () => unsubUser();
  }, [user]);

  /** supabase **/
  // useEffect(() => {
  //   if (userCred === null) return;

  //   const unsubUser = onSnapshot(
  //     doc(firestore, "users", userCred?.email),
  //     (doc) => {
  //       console.log("userData: ", doc.data());
  //       setUserData(doc.data());
  //     }
  //   );
  //   return () => unsubUser();
  // }, [userCred]);

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
            {/* <img
              src="./undraw_chat_mobile-removebg.png"
              alt="cha illustration"
              className="max-w-[300px]"
            /> */}
            <svg
              className="w-24 h-24 mb-4 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="8" y1="16" x2="16" y2="16" />
              <path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
            </svg>
            <h2 className="text-2xl font-semibold mb-2">No contacts found</h2>
            <p className="text-muted-foreground mb-4">
              Your contact list is empty. Add your first contact to get started!
            </p>
            <button
              className="btn"
              onClick={() =>
                document.getElementById("addFriendModal").showModal()
              }
            >
              <UserPlusIcon className="mr-2 h-4 w-4" />
              Add New Contact
            </button>
          </div>
        )}
        <AddFriendModal id="addFriendModalNavbar" userData={userData} />
      </div>
    );
  }
  return <LoadingSkeleton />;
}
