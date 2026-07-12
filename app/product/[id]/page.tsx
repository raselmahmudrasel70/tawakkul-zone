export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-5xl p-10">
      <h1 className="text-4xl font-bold text-green-700">
        Product #{id}
      </h1>

      <p className="mt-4 text-gray-600">
        এটি Product ID: {id}
      </p>
    </div>
  );
}