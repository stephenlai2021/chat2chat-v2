/* next */
import { redirect } from 'next/navigation'

/* supabase */
import getUserSession from "@/lib/supabase/getUserSession"

/* components */
import Main from "./Main";

export default async function RegisterPage() {
  const {
    data: { session },
  } = await getUserSession();
  
  // protect route
  if (session) redirect("/");
  console.log('user session | register page: ', session?.user)

  return <Main />;
}
