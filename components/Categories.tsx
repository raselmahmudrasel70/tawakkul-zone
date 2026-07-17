"use client";

export default function Categories({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}) {
  const categories = [
    "All Products",
    "Three Piece",
    "Saree",
    "Abaya",
    "Hijab",
    "Fabric",
    "Kids",
  ];

  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-green-900">
          🛍️ Categories
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-green-700 text-white shadow-lg"
                  : "border border-green-200 bg-green-50 text-green-800 hover:bg-green-700 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}