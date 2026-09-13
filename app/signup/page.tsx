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
  const [phone, setPhone] = useState("");

  const isValidGmail = (email: string) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const isValidBDPhone = (phone: string) => {
    const bdPhoneRegex = /^(013|014|015|016|017|018|019)\d{8}$/;
    return bdPhoneRegex.test(phone);
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Google Sign Up Failed",
        text: error.message,
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name Required",
        text: "Please enter your full name",
      });
      return;
    }

    if (!isValidGmail(email)) {
      Swal.fire({
        icon: "warning",
        title: "‼️Invalid Email‼️",
        html: `
          <p style="color:#dc2626;font-weight:600;">
            Please enter a valid Gmail address
          </p>
        `,
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    if (!isValidBDPhone(phone)) {
      Swal.fire({
        icon: "warning",
        title: "‼️Invalid Phone Number‼️",
        html: `
          <p style="color:#dc2626; font-weight:600;">
            Please enter a valid Bangladesh mobile number
          </p>
        `,
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password mismatch",
        text: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    const username =
      "TZ" +
      crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
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
        title: "Account Created‼️",
        html: `
          <p style="color:#16a34a;">
            Your account has been created successfully.
          </p>
          <p style="color:#dc2626; font-weight:bold; margin-top:8px;">
            Please verify your email before logging in.
          </p>
        `,
        confirmButtonText: "Go to Login",
        confirmButtonColor: "#16a34a",
      });
      router.push("/login");
    }

    setLoading(false);
  };

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

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md bg-transparent backdrop-blur-xl rounded-2xl border border-white/70 shadow-2xl px-8 py-10">
        {/* Brand */}
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold leading-none">
            <span className="text-cyan-700">Tawakkul</span>{" "}
            <span className="text-amber-500">Zone</span>
          </h1>

          <p className="text-center text-blue-500 mt-3">
            Create Your Account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-900">
              * Name
            </label>

            <div className="flex items-center border-b-2 border-cyan-300">
              <User className="h-5 w-5 text-cyan-600" />

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-3 outline-none bg-transparent text-black"
              />
            </div>
          </div>

          {/* Email */}
<div>
  <label className="text-sm text-gray-900">
    * Email Address
  </label>

  <div className="flex items-center border-b-2 border-cyan-300">
    <Mail className="h-5 w-5 text-cyan-600" />

    <input
  type="email"
  autoComplete="off"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
  className="w-full bg-transparent px-3 py-3 text-black outline-none"
/>
  </div>
</div>

          {/* Phone */}
<div>
  <label className="text-sm text-gray-900">
    * Phone
  </label>

  <div className="flex items-center border-b-2 border-cyan-300">
    <input
      type="tel"
      inputMode="numeric"
      maxLength={11}
      className="w-full bg-transparent px-3 py-3 text-black outline-none"
      placeholder="01XXXXXXXXX"
      value={phone}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "");

        if (value.length <= 11) {
          setPhone(value);
        }
      }}
    />
  </div>
</div>

          {/* Password */}
<div>
  <label className="text-sm text-gray-900">
    * Password
  </label>

  <div className="flex items-center border-b-2 border-cyan-300">
    <Lock className="h-5 w-5 text-cyan-600" />

    <input
  type={showPassword ? "text" : "password"}
  autoComplete="new-password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter password"
  className="w-full bg-transparent px-3 py-3 text-black outline-none"
/>

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5 text-blue-600" />
      ) : (
        <Eye className="h-5 w-5 text-blue-600" />
      )}
    </button>
  </div>
</div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-600">
              * Confirm Password
            </label>

            <div className="flex items-center border-b-2 border-cyan-300">
              <input
  type={showConfirmPassword ? "text" : "password"}
  autoComplete="new-password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  placeholder="Confirm password"
  className="w-full bg-transparent py-3 text-black outline-none"
/>
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-blue-600" />
                ) : (
                  <Eye className="h-5 w-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* Create Account */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 py-4 rounded-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-400 hover:scale-[1.02] transition shadow-lg disabled:opacity-60"
          >
            {loading ? "Creating..." : "CREATE ACCOUNT"}
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

          {/* Login */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?

            <a
              href="/login"
              className="text-cyan-600 font-semibold ml-1"
            >
              Sign In
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