export default function Categories() {
  const categories = [
    "থ্রী পিস",
    "শাড়ী",
    "বোরকা",
    "হিজাব",
    "গজ কাপড়",
    "বাচ্চাদের জন্য",
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-bold text-green-900">
          🛍️ Shop by Category
        </h2>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <button
              key={category}
              className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center font-semibold text-green-800 transition hover:bg-green-700 hover:text-white"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}