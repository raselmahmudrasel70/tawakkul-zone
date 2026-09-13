export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-8 text-4xl font-bold text-green-700">
        Privacy Policy
      </h1>

      <div className="space-y-6 text-gray-700 leading-8">
        <p>
          At <strong>Tawakkul Zone</strong>, we value your privacy. This Privacy
          Policy explains how we collect, use, and protect your personal
          information.
        </p>

        <h2 className="text-2xl font-semibold">Information We Collect</h2>
        <p>
          We may collect your name, email address, phone number, shipping
          address, and order details when you use our website.
        </p>

        <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
        <ul className="list-disc pl-6">
          <li>Process your orders</li>
          <li>Deliver products</li>
          <li>Provide customer support</li>
          <li>Improve our services</li>
        </ul>

        <h2 className="text-2xl font-semibold">Security</h2>
        <p>
          We take reasonable measures to protect your information from
          unauthorized access.
        </p>

        <h2 className="text-2xl font-semibold">Contact</h2>
        <p>
          If you have any questions, please contact us through Tawakkul Zone.
        </p>
      </div>
    </main>
  );
}