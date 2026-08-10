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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="sun" />
        <div className="sun-glow" />

        <div className="sun-ray ray-1" />
        <div className="sun-ray ray-2" />
        <div className="sun-ray ray-3" />
        <div className="sun-ray ray-4" />
        <div className="sun-ray ray-5" />

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

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl border border-white/70 shadow-2xl px-8 py-10">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold leading-none">
            <span className="text-cyan-300">Tawakkul</span>{" "}
            <span className="text-amber-300">Zone</span>
          </h1>

          <p className="text-center text-gray-500 mt-3">
            Welcome Back
          </p>
        </div>

        <form onSubmit={login} className="space-y-5">
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
                className="w-full px-3 py-3 outline-none bg-transparent text-black"
                required
              />
            </div>
          </div>

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
                className="w-full px-3 py-3 outline-none bg-transparent text-black"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 py-4 rounded-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-400 hover:scale-[1.02] transition shadow-lg disabled:opacity-60"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

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

          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?

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

          animation: rayPulse 3.5s ease-in-out infinite;
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

        .cloud {
          position: absolute;
          width: 280px;
          height: 85px;
          border-radius: 9999px;
          opacity: 0.92;
          filter: blur(0.15px);

          background:
            radial-gradient(
              ellipse at 50% 85%,
              rgba(255, 255, 255, 0.96) 0%,
              rgba(255, 255, 255, 0.82) 42%,
              rgba(255, 255, 255, 0) 75%
            );

          animation: cloudDrift 55s linear infinite;

          box-shadow:
            0 18px 35px rgba(90, 130, 145, 0.10),
            0 4px 12px rgba(255, 255, 255, 0.35);
        }

        .cloud::before,
        .cloud::after {
          content: "";
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
        }

        .cloud::before {
          width: 150px;
          height: 105px;
          left: 48px;
          bottom: 12px;

          background:
            radial-gradient(
              ellipse at 45% 40%,
              rgba(255, 255, 255, 1) 0%,
              rgba(249, 253, 254, 0.96) 42%,
              rgba(228, 242, 246, 0.78) 72%,
              rgba(210, 230, 235, 0) 100%
            );

          filter: blur(0.4px);
        }

        .cloud::after {
          width: 115px;
          height: 78px;
          right: 28px;
          bottom: 18px;

          background:
            radial-gradient(
              ellipse at 50% 35%,
              rgba(255, 255, 255, 0.98) 0%,
              rgba(245, 251, 253, 0.92) 48%,
              rgba(215, 233, 238, 0) 100%
            );

          filter: blur(0.5px);
        }

        .cloud span {
          position: absolute;
          display: block;
          border-radius: 9999px;
          bottom: 0;

          background:
            radial-gradient(
              ellipse at 50% 25%,
              rgba(255, 255, 255, 0.98) 0%,
              rgba(247, 252, 253, 0.94) 45%,
              rgba(221, 238, 242, 0.72) 72%,
              rgba(200, 224, 231, 0.05) 100%
            );

          box-shadow:
            inset 0 8px 18px rgba(255, 255, 255, 0.45),
            0 10px 24px rgba(83, 139, 156, 0.08);

          filter: blur(0.35px);
        }

        .cloud span:nth-child(1) {
          left: 0;
          width: 92px;
          height: 58px;
        }

        .cloud span:nth-child(2) {
          left: 48px;
          width: 105px;
          height: 82px;
        }

        .cloud span:nth-child(3) {
          left: 118px;
          width: 92px;
          height: 65px;
        }

        .cloud span:nth-child(4) {
          left: 188px;
          width: 70px;
          height: 50px;
        }

        .cloud-1 {
          top: 15%;
          left: -320px;
          transform: scale(1);
          animation-duration: 58s;
        }

        .cloud-2 {
          top: 31%;
          left: -380px;
          transform: scale(0.72);
          animation-duration: 72s;
          animation-delay: -24s;
          opacity: 0.68;
        }

        .cloud-3 {
          top: 53%;
          left: -330px;
          transform: scale(1.15);
          animation-duration: 66s;
          animation-delay: -41s;
          opacity: 0.76;
        }

        .cloud-4 {
          top: 69%;
          left: -300px;
          transform: scale(0.62);
          animation-duration: 78s;
          animation-delay: -13s;
          opacity: 0.54;
        }

        @keyframes cloudDrift {
          0% {
            margin-left: 0;
            transform: translate3d(0, 0, 0);
          }

          25% {
            transform: translate3d(0, -5px, 0);
          }

          50% {
            transform: translate3d(0, 3px, 0);
          }

          75% {
            transform: translate3d(0, -4px, 0);
          }

          100% {
            margin-left: calc(100vw + 650px);
            transform: translate3d(0, 0, 0);
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