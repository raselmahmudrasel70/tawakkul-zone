import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[80vh] w-full">
      <Image
        src="/banner.jpg"
        alt="Tawakkul Zone Banner"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-2xl">
  <span className="text-cyan-500">Tawakkul</span>{" "}
  <span className="text-amber-300">Zone</span>
</h1>

          <p className="mt-4 text-2xl font-semibold text-white drop-shadow-lg">
  বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা।
</p>

          <button className="mt-8 rounded-xl bg-yellow-400 px-8 py-3 font-bold text-black hover:bg-yellow-300">
            এখনই কিনুন
          </button>
        </div>
      </div>
    </section>
  );
}