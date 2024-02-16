/* next */
import { redirect } from "next/navigation";

/* supabase */
import getUserSession from "@/lib/supabase/getUserSession";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/* components */
import Main from "./Main";

export default async function LoginPage() {
  // const supabase = await createSupabaseServerClient();
  // await supabase.auth.signOut();

  const {
    data: { session },
  } = await getUserSession();
  console.log("user session | login page: ", session?.user);

  if (session) redirect("/");

  return <Main />;
}
