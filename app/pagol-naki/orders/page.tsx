import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = supabaseAdmin;

const {
  data: { user },
} = await supabase.auth.getUser();

console.log("SERVER USER =", user);

const { data: orders, error } = await supabase
  .from("orders")
  .select("*")
  .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-7xl p-6">
        <p className="rounded-lg bg-red-100 p-4 text-red-600">
          {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold text-green-700">
        📦 Orders
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <h2 className="text-2xl font-bold text-red-700">
            No Orders Found
          </h2>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="p-4 text-left">Order ID</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-200"
                >
                  <td className="p-4 font-semibold text-yellow-700">
                    #{order.id}
                  </td>

                  <td className="p-4 text-black">
                    {order.customer_name}
                  </td>

                  <td className="p-4 text-cyan-700">
                    {order.phone}
                  </td>

                  <td className="p-4 text-red-500">
                    ৳ {order.total}
                  </td>

                  <td className="p-4">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4 text-black">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}