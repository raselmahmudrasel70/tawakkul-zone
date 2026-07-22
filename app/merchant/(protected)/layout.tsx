import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export default async function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("========== MERCHANT DEBUG ==========");
  console.log("USER:", user);
  console.log("ERROR:", error);

  if (!user) {
    console.log("❌ No user found. Redirecting to /merchant/login");
    redirect("/merchant/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log("PROFILE:", profile);
  console.log("PROFILE ERROR:", profileError);

  if (!profile || profile.role !== "merchant") {
    console.log("❌ Invalid merchant profile. Redirecting to /merchant/login");
    redirect("/merchant/login");
  }

  console.log("✅ Merchant authenticated");

  return <>{children}</>;
}