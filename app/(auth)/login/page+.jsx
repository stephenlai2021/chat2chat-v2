/* next */
import { redirect } from "next/navigation";

/* supabase */
import getUserSession from "@/lib/supabase/getUserSession";

/* components */
import Main from "./page";

export default async function LoginPage() {
  // const {
  //   data: { session },
  // } = await getUserSession();
  // console.log("user session | login page: ", session?.user);

  // if (session) redirect("/");

  return <Main />;
}
