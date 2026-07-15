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

export default function SignupPage() {

const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(false);
const router = useRouter();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  setLoading(true);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }

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
if (data.user) {
  alert("Account created successfully!");
  router.push("/pagol-naki");
}
  setLoading(false);
};
    return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-100 via-yellow-100 to-yellow-50 px-4 py-10">
      {/* Background Effects */}

<div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-green-700/10 blur-3xl"></div>

<div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-yellow-400/20 blur-3xl"></div>
      <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur-xl">
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
    Username
  </label>

  <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-4 transition focus-within:border-green-700 focus-within:ring-4 focus-within:ring-green-100">
    <User className="h-5 w-5 text-green-700" />

    <input
  type="text"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  placeholder="Choose your username"
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
  className="w-full rounded-xl bg-green-700 py-3 font-bold text-white hover:bg-green-800 disabled:opacity-50"
>
  {loading ? "Creating..." : "Create Account"}
</button>

        </form>

      </div>
    </main>
  );
}