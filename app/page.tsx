export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-green-800 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">
            Tawakkul <span className="text-yellow-400">Zone</span>
          </h1>

          <nav className="hidden gap-6 md:flex">
            <a href="#">হোম</a>
            <a href="#">দোকান</a>
            <a href="#">পুরুষ</a>
            <a href="#">নারী</a>
            <a href="#">যোগাযোগ</a>
          </nav>

          <button className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-400">
            Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex h-[80vh] items-center justify-center bg-gradient-to-r from-green-800 to-green-600 text-center text-white">
        <div>
          <h2 className="mb-4 text-5xl font-bold">
            বিশ্বাসে শুরু, বিশ্বস্ততায় পথচলা
          </h2>

          <p className="mb-8 text-xl">
            Premium Modest Fashion for Everyone
          </p>

          <button className="rounded-xl bg-yellow-400 px-8 py-3 text-lg font-bold text-black hover:bg-yellow-300">
            Shop Now
          </button>
        </div>
      </section>
    </main>
  );
}