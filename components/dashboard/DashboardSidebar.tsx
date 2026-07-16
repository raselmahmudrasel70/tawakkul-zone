"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    name: "My Orders",
    href: "/dashboard/orders",
    icon: Package,
  },
  {
    name: "Wishlist",
    href: "/dashboard/wishlist",
    icon: Heart,
  },
  {
    name: "Address",
    href: "/dashboard/address",
    icon: MapPin,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-cyan-20 min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold">

  <span className="text-cyan-300">Tawakkul</span>{" "}

                <span className="text-amber-300">Zone</span> 

</h2>



<p className="text-xs text-red-600">

  বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা

</p>
      </div>

      <nav className="px-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors
${
  pathname === item.href
  ? "bg-emerald-600 text-white"
  : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
}`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}

        <button
          className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </aside>
  );
}