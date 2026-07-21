import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/admin-auth";

export default async function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("admin-auth")?.value;

  if (!token) {
    redirect("/merchant/login");
  }

  const user = await verifyAdminToken(token);

  if (!user || user.role !== "merchant") {
    redirect("/merchant/login");
  }

  return <>{children}</>;
}