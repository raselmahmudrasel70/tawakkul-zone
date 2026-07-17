import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[35vh] md:h-screen w-full overflow-hidden">
     {/* Desktop */}
<Image
  src="/banner-desktop.jpg"
  alt="Desktop Banner"
  fill
  priority
  sizes="100vw"
  className="hidden md:block object-cover"
/>

{/* Mobile */}
<Image
  src="/banner-desktop.jpg"
  alt="Mobile Banner"
  fill
  priority
  sizes="100vw"
  className="block md:hidden object-cover"
/>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold drop-shadow-2xl">
            <span className="text-cyan-500">Tawakkul</span>{" "}
            <span className="text-amber-300">Zone</span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl md:text-4xl font-semibold drop-shadow-lg">
            বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা।
          </p>

          <button className="mt-8 rounded-xl bg-yellow-400 px-8 py-3 font-bold text-black hover:bg-yellow-300 transition">
            অর্ডার করতে সাইন আপ করুন 😊
          </button>
        </div>
      </div>
    </section>
  );
}