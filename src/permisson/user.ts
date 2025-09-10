import supabase from "@/lib/supabase";

export async function userIsAdmin() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return false;
  }

  const { data } = await supabase.rpc("get_user_role", {
    uid: user!.id,
  });

  console.log(data);

  if (data && data[0].role == "ADMIN") return true;
  return false;
}
