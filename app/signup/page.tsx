"use client";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
export default function SignupPage() {
const [fullName, setFullName] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(false);
const router = useRouter();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
if (!fullName.trim()) {
  alert("Please enter your full name");
  return;
}
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  setLoading(true);
setLoading(true);

const username =
  "TZ" +
  crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      username: username,
      full_name: fullName,
    },
  },
});

 if (error) {
  alert(error.message);
  setLoading(false);
  return;
}

if (data.user) {
  await Swal.fire({
    icon: "success",
    title: "Account Created!",
    html: `
      <p class="text-green-600">Your account has been created successfully.</p>
      <p class="text-red-600"><b>Please verify your email before logging in.</b></p>
    `,
    confirmButtonText: "Go to Login",
    confirmButtonColor: "#16a34a",
  });

  router.push("/login");
}

setLoading(false);

  /*if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        username,
      });

    if (profileError) {
      alert(profileError.message);
    }

    alert("Account created successfully!");

    router.push("/pagol-naki");
  }*/

};
    return (
    <main className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">

<div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-green-700/10 blur-3xl"></div>

<div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-yellow-400/20 blur-3xl"></div>
      <div
  className="
    relative z-10
    w-full
    max-w-md
    md:max-w-lg
    lg:max-w-xl
    rounded-[32px]
    border border-white/60
    bg-white/90
    p-6
    md:p-8
    lg:p-10
    shadow-2xl
    backdrop-blur-xl
  "
>
       <div className="mb-6 flex justify-center">
  <img
    src="/logo.png"
    alt="Tawakkul Zone"
    className="h-20 w-auto"
  />
</div>
        <h1 className="text-center text-4xl font-extrabold text-green-900">
          Create Account
        </h1>

        <p className="mb-8 mt-2 text-center text-gray-600">
          Join Tawakkul Zone
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
  <label className="mb-2 block font-semibold text-blue-600">
    Enter Your Full Name
  </label>
<div className="flex items-center rounded-2xl border border-gray-200 bg-white px-4 transition focus-within:border-green-700 focus-within:ring-4 focus-within:ring-green-100">
  <User className="h-5 w-5 text-green-700" />

  <input
    type="text"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    placeholder="Enter your full name"
    className="w-full bg-transparent px-3 py-4 text-gray-900 placeholder:text-gray-500 outline-none"
  />
  </div>
</div>
          <div>
  <label className="mb-2 block font-semibold text-blue-600">
    Email Address
  </label>

  <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
    <Mail className="h-5 w-5 text-blue-600" />

    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      className="w-full bg-transparent px-3 py-4 text-gray-900 placeholder:text-gray-500 outline-none"
    />
  </div>
</div>

          <div>
  <label className="mb-2 block font-semibold text-blue-600">
    Password
  </label>

  <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
    <Lock className="h-5 w-5 text-blue-600" />

    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter your password"
      className="w-full bg-transparent px-3 py-4 text-gray-900 placeholder:text-gray-500 outline-none"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="text-blue-600"
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  </div>
</div>

          <div>
  <label className="mb-2 block font-semibold text-blue-600">
    Confirm Password
  </label>

  <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
    <Lock className="h-5 w-5 text-blue-600" />

    <input
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Confirm your password"
      className="w-full bg-transparent px-3 py-4 text-gray-900 placeholder:text-gray-500 outline-none"
    />
  </div>
</div>

          <button
  type="submit"
  disabled={loading}
  className="mt-2 w-full rounded-2xl bg-emerald-600 py-4 text-lg font-bold text-white transition duration-300 hover:bg-emerald-700"
>
  {loading ? "Creating..." : "Create Account"}
</button>

        </form>

      </div>
    </main>
  );
}