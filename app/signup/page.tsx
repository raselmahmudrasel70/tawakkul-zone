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
const [phone,setPhone] = useState("");


// এখানে বসবে ✅
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
      icon:"warning",
      title:"Name Required",
      text:"Please enter your full name"
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


  if(password !== confirmPassword){
    Swal.fire({
      icon:"warning",
      title:"Password mismatch",
      text:"Passwords do not match"
    });
    return;
  }


  setLoading(true);


  // Supabase signup code এখানে থাকবে




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

    router.push("/admin");
  }*/

};
   return (
<main className="
relative 
min-h-screen 
overflow-hidden
px-4 
pt-24 
pb-16 
flex 
items-center 
justify-center
bg-gradient-to-br 
from-cyan-50 
via-pink-50
to-green-50
">
{/* Animated Background */}

<div className="
absolute
-top-20
-left-20
h-96
w-96
rounded-full
bg-cyan-300/30
blur-3xl
animate-pulse
"/>


<div className="
absolute
top-40
right-10
h-72
w-72
rounded-full
bg-emerald-300/20
blur-3xl
animate-bounce
[animation-duration:8s]
"/>


<div className="
absolute
bottom-0
left-20
h-80
w-80
rounded-full
bg-blue-300/20
blur-3xl
animate-pulse
[animation-duration:6s]
"/>


<div className="
absolute
bottom-20
right-0
h-96
w-96
rounded-full
bg-yellow-200/30
blur-3xl
animate-bounce
[animation-duration:10s]
"/>

  {/* Background Glow */}
  <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-cyan-100/30 blur-3xl" />
  <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-green-100/30 blur-3xl" />


  <div
    className="
    relative z-10
    w-full
    max-w-md
    bg-white
    rounded-sm
    shadow-2xl
    px-8
    py-10
    "
  >


    {/* Brand */}

    <h1
    className="
    text-center
    text-3xl
    font-bold
    text-gray-900
    "
    >
      Create Your Account
    </h1>


    <p className="
    text-center
    text-gray-500
    mt-2
    mb-8
    ">
      Join Tawakkul Zone
    </p>



<form onSubmit={handleSubmit} className="space-y-5">



{/* Full Name */}

<div>

<label className="text-sm text-gray-600">
* Name
</label>

<div className="
flex items-center
border-b-2
border-cyan-300
">

<User className="h-5 w-5 text-cyan-600"/>

<input
type="text"
value={fullName}
onChange={(e)=>setFullName(e.target.value)}
placeholder="Enter your full name"
className="
w-full
px-3
py-3
outline-none
bg-transparent
text-black
"
/>

</div>

</div>




{/* Email */}

<div>

<label className="text-sm text-gray-600">
* Email Address
</label>


<div className="
flex items-center
border-b-2
border-cyan-300
">

<Mail className="h-5 w-5 text-cyan-600"/>


<input
type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Enter your email"
className="
w-full
px-3
py-3
outline-none
bg-transparent
text-black
"
/>


</div>

</div>

{/* Phone */}

<div>

<label className="text-sm text-gray-600">
* Phone
</label>


<div className="
border-b-2
border-cyan-300
">


<input
  type="tel"
  inputMode="numeric"
  maxLength={11}
  className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm focus:border-emerald-600 focus:outline-none"
  placeholder="01XXXXXXXXX"
  value={phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");

    // সর্বোচ্চ 11 digit
    if (value.length <= 11) {
      setPhone(value);
    }
  }}
/>


</div>

</div>





{/* Password */}

<div>

<label className="text-sm text-gray-600">
* Password
</label>


<div className="
flex items-center
border-b-2
border-cyan-300
">


<Lock className="h-5 w-5 text-cyan-600"/>


<input
type={showPassword ? "text":"password"}
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="Enter password"
className="
w-full
px-3
py-3
outline-none
bg-transparent
text-black
"
/>


<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
>

{
showPassword ?
<EyeOff className="h-5 w-5 text-blue-600"/>
:
<Eye className="h-5 w-5 text-blue-600"/>
}

</button>


</div>

</div>





{/* Confirm Password */}

<div>

<label className="text-sm text-gray-600">
* Confirm Password
</label>


<div className="
border-b-2
border-cyan-300
">


<input
type="password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
placeholder="Confirm password"
className="
w-full
py-3
outline-none
bg-transparent
text-black
"
/>


</div>


</div>






<button
type="submit"
disabled={loading}
className="
w-full
mt-5
py-4
rounded-sm
font-bold
text-white
bg-gradient-to-r
from-blue-600
to-cyan-400
hover:scale-[1.02]
transition
shadow-lg
"
>

{
loading ? "Creating..." : "CREATE ACCOUNT"
}

</button>





<div className="flex items-center my-6">

<div className="flex-1 h-px bg-gray-300"/>

<span className="px-3 text-gray-400 text-sm">
OR
</span>

<div className="flex-1 h-px bg-gray-300"/>

</div>





<button
type="button"
onClick={loginWithGoogle}
className="
w-full
py-3
border
rounded-sm
flex
justify-center
items-center
gap-3
font-semibold
text-gray-700
hover:bg-gray-50
"
>


<img
src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
className="h-5 w-5"
/>


Continue with Google


</button>





<p className="
text-center
mt-6
text-sm
text-gray-600
">

Already have an account?

<a
href="/login"
className="
text-cyan-600
font-semibold
ml-1
"
>
Sign In
</a>

</p>



</form>


</div>


</main>
  );

}