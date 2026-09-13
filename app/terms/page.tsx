export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-4xl font-bold text-green-700">
        Terms & Conditions
      </h1>

      <div className="space-y-6 text-gray-700 leading-8">
        <p>
          Welcome to <strong>Tawakkul Zone</strong>. By using our website, you
          agree to the following terms and conditions.
        </p>

        <h2 className="text-2xl font-semibold">Orders</h2>
        <p>
          All orders are subject to product availability and confirmation.
        </p>

        <h2 className="text-2xl font-semibold">Pricing</h2>
        <p>
          Prices may change without prior notice. We reserve the right to
          correct pricing errors.
        </p>

        <h2 className="text-2xl font-semibold">Returns</h2>
        <p>
          Return and replacement requests are handled according to our return
          policy.
        </p>

        <h2 className="text-2xl font-semibold">User Responsibility</h2>
        <p>
          Users must provide accurate information and must not misuse the
          website.
        </p>

        <h2 className="text-2xl font-semibold">Contact</h2>
        <p>
          For any questions regarding these Terms, please contact Tawakkul
          Zone.
        </p>
      </div>
    </main>
  );
}