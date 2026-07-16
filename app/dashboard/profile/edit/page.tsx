"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setFullName(data.full_name || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone,
        address: address,
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });

      return;
    }

    Swal.fire({
      icon: "success",
      title: "Profile Updated!",
      text: "Your profile has been updated successfully.",
      confirmButtonColor: "#059669",
    });

    router.push("/dashboard/profile");
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        Edit Profile
      </h1>

      <form
        onSubmit={saveProfile}
        className="space-y-5 rounded-2xl bg-white p-6 shadow"
      >
        <div>
          <label className="mb-2 block font-semibold text-slate-800">
            Full Name
          </label>

          <input
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-slate-900 focus:border-emerald-600 focus:outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-slate-800">
            Phone
          </label>

          <input
           className="w-full rounded-lg border border-gray-300 bg-white p-3 text-slate-900 focus:border-emerald-600 focus:outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-slate-800">
            Address
          </label>

          <textarea
            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-slate-900 focus:border-emerald-600 focus:outline-none"
            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button
          disabled={loading}
          className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}