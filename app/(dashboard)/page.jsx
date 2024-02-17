/* 
  Donot delete this block !!! 
  get user session and pass down to Main component(client component)
  to get user data
*/
// /* supabase */
// import getUserSession from "@/lib/supabase/getUserSession";

// /* components */
// import Main from "./Main";

// export default async function DashoardPage() {
//   const {
//     data: { session },
//   } = await getUserSession();

//   const userCred = session?.user

//   return <Main userCred={userCred} />;
// }

/* supabase */
import getUserSession from "@/lib/supabase/getUserSession";

/* components */
import Main from "./Main";

/* firebase */
import { firestore } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

export default async function DashoardPage() {
  /*
    get user data and pass down to Main component(client component)
  */
  const {
    data: { session },
  } = await getUserSession();
  const userCred = session?.user
  const docRef = doc(firestore, "users", userCred.email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return <Main data={data} />;
  }
}

// export default async function DashoardPage() {
//   /* 
//     get user credential and pass down to Main component(client component)
//   */
//   const {
//     data: { session },
//   } = await getUserSession();
//   const userCred = session?.user;
  
//   return <Main userCred={userCred} />;
// }
