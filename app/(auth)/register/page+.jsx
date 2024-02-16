/* next */
import { redirect } from 'next/navigation'

/* supabase */
import getUserSession from "@/lib/supabase/getUserSession"

/* components */
import Main from "./page";

export default async function RegisterPage() {
  // const {
  //   data: { session },
  // } = await getUserSession();
  
  // if (session) redirect("/");
  // console.log('user session | register page: ', session?.user)

  return <Main />;
}
