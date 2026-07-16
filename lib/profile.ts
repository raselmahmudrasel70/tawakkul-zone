import { supabase } from "./supabase";

export async function getProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code === "PGRST116") {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name: user.user_metadata?.name || "",
      })
      .select()
      .single();

    return newProfile;
  }

  return data;
}