/* Get userData server side */
// import Main from "./Main";

// import { firestore } from "@/lib/firebase/client";
// import { doc, getDoc } from "firebase/firestore";

// import getUserSession from "@/lib/supabase/getUserSession";

// export default async function DashoardPage() {
//   const {
//     data: { session },
//   } = await getUserSession();
//   const userCred = session?.user;

//   const docRef = doc(firestore, "users", userCred.email);
//   const docSnap = await getDoc(docRef);

//   if (docSnap.exists()) {
//     const data = docSnap.data();
//     return <Main data={data} />;
//   }
// }

/* Get userData realtime */
"use client";

/* components */
import Main from "./Main";
import LoadingSkeleton from "@/components/skeleton/LoadingSkeleton";

/* react */
import { useEffect, useState } from "react";

/* firebase */
import { firestore } from "@/lib/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";

/* supabase */
import getUserSession from "@/lib/supabase/getUserSession";

export default function DashoardPage() {
  const [userData, setUserData] = useState(null);
  const [userCred, setUserCred] = useState(null);

  const getUserData = async () => {
    const {
      data: { session },
    } = await getUserSession();
    setUserCred(session?.user);
  };

  useEffect(() => {
    if (!userCred) return;
    const unsubUser = onSnapshot(
      doc(firestore, "users", userCred?.email),
      (doc) => {
        console.log("userData: ", doc.data());
        setUserData(doc.data());
      }
    );
    return () => unsubUser();
  }, [userCred]);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    console.log("userData: ", userData);
  }, [userData]);

  // if (userData != null) return <Main data={userData} />
  if (userData) {
    return <Main data={userData} />;
  } else {
    return <LoadingSkeleton />;
  }
}
