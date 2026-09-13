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
    "Skin Care",
    "Socks",
    "Hijab",
    "Fabric",
    "Kids",
  ];

  return (
    // py-4 কমিয়ে py-2 করা হয়েছে যাতে হাইট ও উইডথ কম লাগে
    <section className="bg-white py-1 border-b border-gray-100 shadow-sm sticky top-0 z-50">
      {/* max-w-7xl কমিয়ে max-w-4xl অথবা max-w-5xl করতে পারেন আপনার পছন্দমতো উইডথ এর জন্য */}
      <div className="mx-auto max-w-4xl px-4">
        {/* gap-4 কমিয়ে gap-2 করা হয়েছে এবং বাটনগুলো কাছাকাছি আনা হয়েছে */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto whitespace-nowrap pb-1 sm:pb-0 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              // px-6 py-3 কমিয়ে px-4 py-1.5 করা হয়েছে সাইজ ছোট করার জন্য
              className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-green-700 text-white shadow-sm scale-102"
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
