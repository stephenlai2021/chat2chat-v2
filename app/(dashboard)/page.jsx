/* Get userData server side */
import Main from "./Main";

import { firestore } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

import getUserSession from "@/lib/supabase/getUserSession";

export default async function DashoardPage() {
  const {
    data: { session },
  } = await getUserSession();
  const userCred = session?.user;

  const docRef = doc(firestore, "users", userCred.email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return <Main userData={data} />;
  }
}

/* Get userData realtime */
// "use client";
// import Main from "./Main";
// import LoadingSkeleton from "@/components/skeleton/LoadingSkeleton";

// import { useEffect, useState } from "react";

// import { firestore } from "@/lib/firebase/client";
// import { doc, onSnapshot } from "firebase/firestore";

// import getUserSession from "@/lib/supabase/getUserSession";

// export default function DashoardPage() {
//   const [userData, setUserData] = useState(null);
//   const [userCred, setUserCred] = useState(null);

//   const getUserData = async () => {
//     const {
//       data: { session },
//     } = await getUserSession();
//     setUserCred(session?.user);
//   };

//   useEffect(() => {
//     getUserData();
//   }, []);

//   useEffect(() => {
//     if (!userCred) return;
//     const unsubUser = onSnapshot(
//       doc(firestore, "users", userCred?.email),
//       (doc) => {
//         console.log("userData: ", doc.data());
//         setUserData(doc.data());
//       }
//     );
//     return () => unsubUser();
//   }, [userCred]);


//   useEffect(() => {
//     console.log("userData: ", userData);
//   }, [userData]);

//   if (userData) return <Main data={userData} />
//   if (userData == null) return <LoadingSkeleton />;
// }

// import Main from "./Main";
// export default function DashoardPage() {
//   return <Main />
// }