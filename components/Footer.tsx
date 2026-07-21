import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTelegram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 bg-green-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-4 md:py-6">

  {/* First Row */}
  <div className="grid grid-cols-2 gap-6">
    {/* Brand */}
    <div>
      <h2 className="text-xl font-bold md:text-2xl">
        <span className="text-cyan-300">Tawakkul</span>{" "}
        <span className="text-yellow-300">Zone</span>
      </h2>

      <p className="mt-2 text-sm text-green-200">
        বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="mb-3 font-semibold">Quick Links</h3>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="https://tawakkulzone.shop" className="text-yellow-300 hover:text-white">
          Home
        </Link>

        <Link href="/cart" className="text-yellow-300 hover:text-white">
          Cart
        </Link>

        <Link href="/" className="text-yellow-300 hover:text-white">
          Products
        </Link>
      </div>
    </div>
  </div>

  {/* Second Row */}
  <div className="mt-6 grid grid-cols-2 gap-6">
    {/* Contact */}
    <div>
      <h3 className="mb-3 font-semibold">Contact</h3>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Phone size={16} />
          01637133488
        </div>

        <div className="flex items-center gap-2 break-all">
          <Mail size={16} />
          info.tawakkulzone@gmail.com
        </div>
      </div>
    </div>

    {/* Social */}
    <div>
      <h3 className="mb-3 font-semibold">Follow Us</h3>

      <div className="flex gap-4 text-xl">
        <a
          href="https://www.facebook.com/tawakkulzonebd"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500"
        >
          <FaFacebook />
        </a>

        <a
          href="https://tawakkulzone.shop"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500"
        >
          <FaInstagram />
        </a>

        <a
          href="https://t.me/tawakkulzonebd"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500"
        >
          <FaTelegram />
        </a>

        <a
          href="https://tawakkulzone.shop"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500"
        >
          <FaYoutube />
        </a>
      </div>
    </div>
  </div>
 <div className="border-t border-cyan-800 py-2 text-center text-sm text-green-300">
        © 2026 Tawakkul Zone. All Rights Reserved.
      </div>
</div>
    </footer>
  );
}