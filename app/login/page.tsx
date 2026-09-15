"use client";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Swal from "sweetalert2";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);

      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
        confirmButtonColor: "#dc2626",
      });

      return;
    }

    setLoading(false);

    await Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome back!",
      confirmButtonColor: "#16a34a",
    });

    router.push("/");
  }

  async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      await Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message,
        confirmButtonColor: "#dc2626",
      });
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pt-24 pb-16 flex items-center justify-center sky-background">

      {/* Animated sky background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="sun" />
        <div className="sun-glow" />

        <div className="sun-ray ray-1" />
        <div className="sun-ray ray-2" />
        <div className="sun-ray ray-3" />
        <div className="sun-ray ray-4" />
        <div className="sun-ray ray-5" />

        {/* Floating clouds */}
        <div className="cloud cloud-1">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="cloud cloud-2">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="cloud cloud-3">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="cloud cloud-4">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-emerald-900/20 to-transparent" />
      </div>


      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-transparent backdrop-blur-xl rounded-2xl border border-white/70 shadow-2xl px-8 py-10">

        {/* Brand */}
        <div className="mb-7 text-center">

          <h1 className="text-3xl font-bold leading-none">
            <span className="text-cyan-700">Tawakkul</span>{" "}
            <span className="text-amber-500">Zone</span>
          </h1>

          <p className="text-center text-blue-500 mt-3">
            Welcome Back
          </p>

        </div>

        <form onSubmit={login} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">
              * Email Address
            </label>

            <div className="flex items-center border-b-2 border-cyan-300">

              <Mail className="h-5 w-5 text-cyan-600" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="off"
                className="w-full px-3 py-3 outline-none bg-transparent text-black"
                required
              />

            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">
              * Password
            </label>

            <div className="flex items-center border-b-2 border-cyan-300">

              <Lock className="h-5 w-5 text-cyan-600" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="new-password"
                className="w-full px-3 py-3 outline-none bg-transparent text-black"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-blue-600" />
                ) : (
                  <Eye className="h-5 w-5 text-blue-600" />
                )}
              </button>

            </div>
          </div>

          {/* Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 py-4 rounded-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-400 hover:scale-[1.02] transition shadow-lg disabled:opacity-60"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          {/* OR */}
          <div className="flex items-center my-6">

            <div className="flex-1 h-px bg-gray-300" />

            <span className="px-3 text-gray-400 text-sm">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-300" />

          </div>

          {/* Google */}
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-3 border rounded-sm flex justify-center items-center gap-3 font-semibold text-gray-700 hover:bg-gray-50"
          >

            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              className="h-5 w-5"
              alt="Google"
            />

            Continue with Google

          </button>

          {/* Signup */}
          <p className="text-center mt-6 text-sm text-gray-600">

            Don&apos;t have an account?

            <a
              href="/signup"
              className="text-cyan-600 font-semibold ml-1"
            >
              Sign Up
            </a>

          </p>

        </form>

      </div>

      <style jsx>{`
        .sky-background {
          background:
            linear-gradient(
              180deg,
              #65d7f2 0%,
              #9be8f5 35%,
              #d7f5ee 72%,
              #b8dfc0 100%
            );
        }

        /* Bright moving sun */
        .sun {
          position: absolute;
          width: 118px;
          height: 118px;
          right: 11%;
          top: 8%;
          border-radius: 9999px;

          background:
            radial-gradient(
              circle at 35% 35%,
              #fffef0 0%,
              #fff7a8 38%,
              #ffd34d 72%,
              #ffb300 100%
            );

          box-shadow:
            0 0 35px rgba(255, 229, 116, 0.95),
            0 0 110px rgba(255, 214, 79, 0.7);

          animation: none;
        }

        .sun-glow {
          position: absolute;
          width: 300px;
          height: 300px;
          right: calc(11% - 91px);
          top: calc(8% - 91px);
          border-radius: 9999px;

          background:
            radial-gradient(
              circle,
              rgba(255, 239, 145, 0.38),
              transparent 68%
            );

          animation: glowPulse 4s ease-in-out infinite;
        }

        /* Sun rays */
        .sun-ray {
          position: absolute;
          right: 16%;
          top: 17%;
          width: 220px;
          height: 14px;
          border-radius: 9999px;

          background:
            linear-gradient(
              90deg,
              rgba(255, 255, 220, 0.62),
              rgba(255, 255, 220, 0)
            );

          transform-origin: right center;
          filter: blur(3px);

          animation:
            rayPulse 3.5s ease-in-out infinite;
        }

        .ray-1 {
          transform: rotate(18deg);
        }

        .ray-2 {
          transform: rotate(48deg);
          animation-delay: 0.6s;
        }

        .ray-3 {
          transform: rotate(-12deg);
          animation-delay: 1.1s;
        }

        .ray-4 {
          transform: rotate(-42deg);
          animation-delay: 1.7s;
        }

        .ray-5 {
          transform: rotate(78deg);
          animation-delay: 2.2s;
        }

        /* Clouds */
        .cloud {
          position: absolute;
          width: 230px;
          height: 55px;
          border-radius: 9999px;
          opacity: 0.82;
          filter: blur(0.2px);

          animation:
            cloudDrift 42s linear infinite;
        }

        .cloud span {
          position: absolute;
          bottom: 0;
          display: block;
          border-radius: 9999px;

          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.98),
              rgba(238, 249, 250, 0.86)
            );

          box-shadow:
            0 10px 22px rgba(83, 139, 156, 0.12);
        }

        .cloud span:nth-child(1) {
          left: 8px;
          width: 85px;
          height: 48px;
        }

        .cloud span:nth-child(2) {
          left: 55px;
          width: 90px;
          height: 70px;
        }

        .cloud span:nth-child(3) {
          left: 112px;
          width: 76px;
          height: 52px;
        }

        .cloud span:nth-child(4) {
          left: 166px;
          width: 55px;
          height: 39px;
        }

        .cloud-1 {
          top: 18%;
          left: -260px;
          animation-duration: 46s;
        }

        .cloud-2 {
          top: 34%;
          left: -330px;
          transform: scale(0.72);
          animation-duration: 58s;
          animation-delay: -19s;
          opacity: 0.58;
        }

        .cloud-3 {
          top: 55%;
          left: -280px;
          transform: scale(1.08);
          animation-duration: 52s;
          animation-delay: -35s;
          opacity: 0.68;
        }

        .cloud-4 {
          top: 70%;
          left: -250px;
          transform: scale(0.6);
          animation-duration: 64s;
          animation-delay: -8s;
          opacity: 0.5;
        }

        @keyframes cloudDrift {
          from {
            margin-left: 0;
          }

          to {
            margin-left: calc(100vw + 520px);
          }
        }

        @keyframes sunset {
          0%,
          12% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }

          48% {
            transform: translateY(36vh) scale(0.88);
            opacity: 0.95;
          }

          62% {
            transform: translateY(52vh) scale(0.72);
            opacity: 0.55;
          }

          70%,
          100% {
            transform: translateY(-10vh) scale(1);
            opacity: 0;
          }
        }

        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.72;
            transform: scale(0.95);
          }

          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes rayPulse {
          0%,
          100% {
            opacity: 0.28;
          }

          50% {
            opacity: 0.82;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sun,
          .sun-glow,
          .sun-ray,
          .cloud {
            animation: none;
          }
        }
      `}</style>

    </main>
  );
}