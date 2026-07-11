import { Search, Heart, ShoppingCart, User } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-green-950/90 backdrop-blur-md text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-cyan-300">Tawakkul</span>{" "}
            <span className="text-amber-300">Zone</span>
          </h1>

          <p className="text-xs text-green-200">
            বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা
          </p>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-96">
          <Search size={18} className="text-gray-500" />

          <input
            className="ml-2 w-full outline-none text-black"
            placeholder="Search Products..."
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">

          <Heart className="cursor-pointer hover:text-pink-400" />

          <ShoppingCart className="cursor-pointer hover:text-yellow-400" />

          <User className="cursor-pointer hover:text-cyan-300" />

        </div>

      </div>
    </header>
  );
}