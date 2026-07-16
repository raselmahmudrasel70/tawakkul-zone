"use client";
import { Mail, Phone, MapPin, Calendar, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
  async function loadProfile() {
    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) return;

setUser(user);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
  }

  loadProfile();
}, []);
if (!profile) {
  return (
    <div className="flex h-80 items-center justify-center">
      Loading...
    </div>
  );
}
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-1 text-gray-500">
          Manage your personal information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl bg-white p-8 shadow">
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-emerald-600 text-6xl font-bold text-red-500">
              {profile.full_name?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="mb-6 text-4xl font-bold text-slate-900">
              {profile.full_name}
            </h2>
<p className="mb-6 text-lg font-medium text-emerald-600">
  @{profile.username}
</p>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="shrink-0 text-emerald-600" size={22} />
                <span className="font-medium text-slate-700">
  {user?.email}
</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="shrink-0 text-emerald-600" size={22} />
                <span className="font-medium text-slate-700">
                  {profile.phone || "No phone added 😅"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="shrink-0 text-emerald-600" size={22} />
                <span className="font-medium text-slate-700">
                  {profile.address || "No address added"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="shrink-0 text-emerald-600" size={22} />
                <span className="font-medium text-slate-700">
                  Joined{" "}
{new Date(profile.created_at).toLocaleDateString("en-US", {
  month: "short",
  year: "numeric",
})}
                </span>
              </div>
            </div>

            <Link
  href="/dashboard/profile/edit"
  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
>
  <Pencil size={18} />
  Edit Profile
</Link>
          </div>
        </div>
      </div>
    </div>
  );
}