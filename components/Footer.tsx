import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube, FaTelegram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 bg-green-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold">
            <span className="text-cyan-300">Tawakkul</span>{" "}
            <span className="text-yellow-300">Zone</span>
          </h2>

          <p className="mt-3 text-sm text-green-200">
            বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 font-semibold">Quick Links</h3>

          <div className="space-y-2">
            <Link href="/">Home</Link><br />
            <Link href="/cart">Cart</Link><br />
            <Link href="/">Products</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-semibold">Contact</h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              01637133488
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} />
              info.tawakkulzone@gmail.com
            </div>
          </div>
        </div>

        {/* Social */}
       <div>
  <h3 className="mb-4 font-semibold">Follow Us</h3>

  <div className="flex gap-5 text-2xl">
    <a
      href="https://www.facebook.com/tawakkulzonebd"
      target="_blank"
      rel="noopener noreferrer"
      className="transition hover:text-blue-500"
    >
      <FaFacebook />
    </a>

    <a
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      className="transition hover:text-pink-500"
    >
      <FaInstagram />
    </a>
    <a 
    href="https://t.me/tawakkulzonebd"
      target="_blank"
      rel="noopener noreferrer"
      className="transition hover:text-pink-500"
    >
      <FaTelegram />
    </a>


    <a
      href="https://youtube.com"
      target="_blank"
      rel="noopener noreferrer"
      className="transition hover:text-red-500"
    >
      <FaYoutube />
    </a>
  </div>
</div>

      </div>

      <div className="border-t border-green-800 py-4 text-center text-sm text-green-300">
        © 2026 Tawakkul Zone. All Rights Reserved.
      </div>
    </footer>
  );
}