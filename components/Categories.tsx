export default function Categories() {
  "use client";
  const categories = [
  "All",
  "Three Piece",
  "Saree",
  "Abaya",
  "Hijab",
  "Fabric",
  "Kids",
];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-bold text-green-900">
          🛍️ Shop by Category
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
  {categories.map((category) => (
    <button
      key={category}
      className="rounded-full border border-green-200 bg-green-50 px-6 py-3 text-sm font-semibold text-green-800 transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:text-white hover:shadow-lg"
    >
      {category}
    </button>
  ))}
</div>
      </div>
    </section>
  );
}