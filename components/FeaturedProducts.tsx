export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Premium Panjabi",
      price: "৳ 2,450",
    },
    {
      id: 2,
      name: "Arabic Jubba",
      price: "৳ 3,200",
    },
    {
      id: 3,
      name: "Prayer Cap",
      price: "৳ 350",
    },
    {
      id: 4,
      name: "Premium Shirt",
      price: "৳ 1,650",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-center text-4xl font-bold">
          ⭐ Featured Products
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-4 h-56 rounded-xl bg-gray-200"></div>

              <h3 className="text-lg font-semibold">{product.name}</h3>

              <p className="mt-2 text-xl font-bold text-green-700">
                {product.price}
              </p>

              <button className="mt-5 w-full rounded-xl bg-green-700 py-2 font-semibold text-white hover:bg-green-800">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}