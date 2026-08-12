import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import PrintInvoiceButton from "@/components/PrintInvoiceButton";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type OrderProduct = {
  name: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  discountedPrice?: number;
  discount?: number;
};

export default async function InvoicePage({
  params,
}: PageProps) {
  const { id } = await params;

  const orderId = Number(id);

  if (!Number.isFinite(orderId)) {
    notFound();
  }

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    notFound();
  }

  const products: OrderProduct[] = Array.isArray(order.products)
    ? order.products
    : [];

  const subtotal = Number(order.subtotal ?? 0);
  const deliveryFee = Number(order.delivery_fee ?? 0);

  const total = Number(
    order.total ?? subtotal + deliveryFee
  );

  const customerName =
    order.customer_name ?? "Customer";

  const phone =
    order.phone ?? "N/A";

  const address =
    order.address ?? "N/A";

  const paymentMethod =
    order.payment_method ?? "N/A";

  const status =
    order.status ?? "Pending";

  const transactionId =
    order.transaction_id ?? "N/A";

  const customerEmail =
    order.email ??
    order.customer_email ??
    "N/A";

  const createdAt = order.created_at
    ? new Date(order.created_at).toLocaleString(
        "en-US",
        {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      )
    : "N/A";

  /*
   * =========================
   * PRICE CALCULATIONS
   * =========================
   */

  const originalTotal = products.reduce(
    (sum, item) => {
      const originalPrice =
        Number(
          item.originalPrice ??
            item.price ??
            0
        );

      const quantity =
        Number(item.quantity ?? 1);

      return (
        sum +
        originalPrice * quantity
      );
    },
    0
  );

  const discountAmount = Math.max(
    0,
    originalTotal - subtotal
  );

  const discountedTotal = subtotal;

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #f3f4f6;
          font-family: Arial, Helvetica, sans-serif;
        }

        .invoice-wrapper {
          width: 100%;
          min-height: 100vh;
          padding: 12px;
          background: #f3f4f6;
        }

        .invoice-paper {
          position: relative;
          width: 100%;
          max-width: 820px;
          margin: 0 auto;
          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 0;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .invoice-paper::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 8px;
          background: #8ed05c;
        }

        .invoice-content {
          padding: 28px 28px 30px 38px;
        }

        /* =========================
           INVOICE HEADER
        ========================= */

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #222;
        }

        .brand-name {
          margin: 0 0 5px;
          font-size: 22px;
          font-weight: 900;
          color: #087f3e;
        }

        .invoice-title {
          margin: 0;
          font-size: 34px;
          line-height: 1;
          font-weight: 900;
          color: #111;
          text-align: right;
        }

        .invoice-number {
          margin-top: 8px;
          color: #555;
          font-size: 10px;
          line-height: 1.6;
        }

        /* =========================
           CUSTOMER / ORDER INFO
        ========================= */

        .info-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          padding: 20px 0 22px;
        }

        .info-title {
          margin: 0 0 8px;
          font-size: 11px;
          font-weight: 700;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .customer-name {
          margin: 0 0 7px;
          font-size: 15px;
          font-weight: 900;
          color: #111;
        }

        .info-line {
          margin: 3px 0;
          color: #555;
          font-size: 10px;
          line-height: 1.4;
        }

        .info-line strong {
          color: #222;
        }

        .order-info {
          text-align: right;
        }

        .order-info .info-line {
          text-align: right;
        }

        /* =========================
           PRODUCT TABLE
        ========================= */

        .product-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #d1d5db;
          border-radius: 0;
        }

        .product-table th {
          padding: 9px 8px;
          background: #48a941;
          color: white;
          font-size: 10px;
          font-weight: 800;
          text-align: left;
        }

        .product-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #d1d5db;
          color: #222;
          font-size: 10px;
          vertical-align: top;
        }

        .product-table th:nth-child(2),
        .product-table td:nth-child(2) {
          text-align: right;
        }

        .product-table th:nth-child(3),
        .product-table td:nth-child(3) {
          width: 45px;
          text-align: center;
        }

        .product-table th:nth-child(4),
        .product-table td:nth-child(4) {
          text-align: right;
        }

        .product-name {
          font-weight: 700;
        }

        .old-price {
          display: inline-block;
          margin-top: 3px;
          color: #777;
          font-size: 8px;
          text-decoration: line-through;
        }

        .discounted-price {
          margin-left: 5px;
          color: #087f3e;
          font-size: 8px;
          font-weight: 700;
        }

        /* =========================
           PAYMENT + TOTAL
        ========================= */

        .bottom-section {
          display: grid;
          grid-template-columns: 1fr 250px;
          gap: 25px;
          margin-top: 22px;
        }

        .payment-box {
          border: 1px solid #bdbdbd;
          border-radius: 0;
          padding: 13px;
        }

        .payment-title {
          margin: 0 0 7px;
          font-size: 11px;
          font-weight: 900;
          color: #444;
        }

        .payment-line {
          margin: 3px 0;
          color: #555;
          font-size: 9px;
        }

        .terms {
          margin-top: 9px;
          color: #777;
          font-size: 8px;
          line-height: 1.4;
        }

        .totals-box {
          background: #eeeeee;
          border-radius: 0;
          padding: 15px 18px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          font-size: 11px;
          color: #555;
        }

        .discount-row {
          color: #555;
        }

        .discount-amount {
          color: #dc2626;
          font-weight: 600;
        }

        .discounted-total {
          color: #087f3e;
          font-weight: 700;
        }

        .total-divider {
          margin: 8px 0;
          border-top: 1px solid #9ca3af;
        }

        .grand-total {
          margin-top: 5px;
          padding-top: 9px;
          border-top: 1px solid #555;
          font-size: 15px;
          font-weight: 900;
          color: #111;
        }

        .grand-total span:last-child {
          color: #087f3e;
        }

        /* =========================
           ACKNOWLEDGEMENT
        ========================= */

        .acknowledgement {
          margin-top: 25px;
        }

        .acknowledgement-title {
          margin: 0 0 8px;
          font-size: 12px;
          font-weight: 900;
          color: #444;
        }

        .acknowledgement p {
          margin: 0 0 6px;
          color: #666;
          font-size: 9px;
          line-height: 1.5;
        }

        /* =========================
           SIGNATURE
        ========================= */

        .signature-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 35px;
          margin-top: 32px;
        }

        .signature {
          text-align: center;
        }

        .signature-line {
          min-height: 55px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 5px;
          border-bottom: 1px solid #222;
          border-radius: 0;
        }

        .customer-signature {
          font-family:
            "Brittany Signature",
            "Brush Script MT",
            "Segoe Script",
            cursive;
          font-size: 25px;
          font-weight: 400;
          color: #111;
          line-height: 1;
          white-space: nowrap;
        }

        .company-signature {
          display: block;
          margin-top: 5px;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #111;
          line-height: 1;
          white-space: nowrap;
        }

        .signature-label {
          margin: 5px 0 0;
          font-size: 9px;
          color: #222;
          font-weight: 500;
        }

        .signature-date {
          margin: 2px 0 0;
          font-size: 8px;
          color: #555;
        }

        .thank-you {
          margin-top: 20px;
          text-align: center;
          color: #555;
          font-size: 9px;
          font-weight: 600;
        }

        /* =========================
           BUTTONS
        ========================= */

        .invoice-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin: 12px auto 20px;
          width: 100%;
          max-width: 820px;
        }

        .invoice-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 130px;
          padding: 10px 14px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
          border: none;
          border-radius: 0;
          cursor: pointer;
        }

        .print-button {
          background: #2563eb;
          color: white;
        }

        .home-button {
          background: #000;
          color: white;
        }

        .dashboard-button {
          background: #087f3e;
          color: white;
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 600px) {
          .invoice-wrapper {
            padding: 0;
          }

          .invoice-paper {
            width: 100%;
            max-width: none;
            border-left: none;
            border-right: none;
            box-shadow: none;
          }

          .invoice-paper::before {
            width: 4px;
          }

          .invoice-content {
            padding: 18px 12px 20px 18px;
          }

          .invoice-header {
            gap: 8px;
            padding-bottom: 10px;
          }

          .brand-name {
            font-size: 16px;
          }

          .invoice-title {
            font-size: 25px;
          }

          .invoice-number {
            font-size: 7px;
          }

          .info-section {
            gap: 10px;
            padding: 12px 0 14px;
          }

          .info-title {
            font-size: 7px;
          }

          .customer-name {
            font-size: 10px;
          }

          .info-line {
            font-size: 7px;
          }

          .product-table th {
            padding: 6px 4px;
            font-size: 7px;
          }

          .product-table td {
            padding: 6px 4px;
            font-size: 7px;
          }

          .old-price,
          .discounted-price {
            font-size: 6px;
          }

          .bottom-section {
            grid-template-columns: 1fr 150px;
            gap: 8px;
            margin-top: 12px;
          }

          .payment-box {
            padding: 7px;
          }

          .payment-title {
            font-size: 7px;
          }

          .payment-line {
            font-size: 6px;
          }

          .terms {
            font-size: 5.8px;
          }

          .totals-box {
            padding: 8px;
          }

          .total-row {
            font-size: 7.5px;
            padding: 3px 0;
          }

          .grand-total {
            font-size: 11px;
          }

          .acknowledgement {
            margin-top: 13px;
          }

          .acknowledgement-title {
            font-size: 8px;
          }

          .acknowledgement p {
            font-size: 6.5px;
            line-height: 1.3;
          }

          .signature-section {
            gap: 12px;
            margin-top: 18px;
          }

          .signature-line {
            min-height: 40px;
          }

          .customer-signature {
            font-size: 17px;
          }

          .company-signature {
            font-size: 8px;
          }

          .signature-label {
            font-size: 6.5px;
            margin-top: 3px;
          }

          .signature-date {
            font-size: 6px;
          }

          .thank-you {
            margin-top: 10px;
            font-size: 6.5px;
          }

          .invoice-actions {
            width: 100%;
            padding: 0 6px;
            gap: 4px;
            margin: 7px auto 10px;
          }

          .invoice-action {
            min-width: 0;
            flex: 1;
            padding: 8px 4px;
            font-size: 8px;
          }
        }

        /* =========================
           PRINT
        ========================= */

        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .invoice-wrapper {
            padding: 0 !important;
            background: white !important;
          }

          .invoice-paper {
            width: 100% !important;
            max-width: none !important;
            min-height: 100vh !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }

          .invoice-actions {
            display: none !important;
          }
        }
      `}</style>

      <main className="invoice-wrapper">

        {/* =========================
            INVOICE
        ========================= */}

        <div className="invoice-paper">

          <div className="invoice-content">

            {/* HEADER */}

            <header className="invoice-header">

              <div>
                <h1 className="brand-name">
                  Tawakkul Zone
                </h1>

                <div className="invoice-number">

                  <div>
                    NO. — #{order.id}
                  </div>

                  <div>
                    ORDER NUMBER — #{order.id}
                  </div>

                  <div>
                    DATE — {createdAt}
                  </div>

                </div>
              </div>

              <div>
                <h2 className="invoice-title">
                  INVOICE
                </h2>
              </div>

            </header>


            {/* CUSTOMER / COMPANY */}

            <section className="info-section">

              {/* CUSTOMER */}

              <div>

                <h3 className="info-title">
                  Invoice To
                </h3>

                <h4 className="customer-name">
                  {customerName}
                </h4>

                <p className="info-line">
                  {address}
                </p>

                <p className="info-line">
                  <strong>Phone:</strong>{" "}
                  {phone}
                </p>

                <p className="info-line">
                  <strong>Email:</strong>{" "}
                  {customerEmail}
                </p>

              </div>


              {/* COMPANY */}

              <div className="order-info">

                <h3 className="info-title">
                  Company
                </h3>

                <h4 className="customer-name">
                  Tawakkul Zone
                </h4>

                <p className="info-line">
                  Online Shopping Platform
                </p>

                <p className="info-line">
                  Bangladesh
                </p>

                <p className="info-line">
                  Payment: {paymentMethod}
                </p>

                <p className="info-line">
                  Status: {status}
                </p>

                <p className="info-line">
                  Transaction ID: {transactionId}
                </p>

              </div>

            </section>


            {/* PRODUCTS */}

            <section>

              <table className="product-table">

                <thead>

                  <tr>

                    <th>
                      Description
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      QTY
                    </th>

                    <th>
                      Subtotal
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {products.map(
                    (item, index) => {

                      const originalPrice =
                        Number(
                          item.originalPrice ??
                            item.price ??
                            0
                        );

                      const finalPrice =
                        item.discountedPrice !==
                        undefined
                          ? Number(
                              item.discountedPrice
                            )
                          : Number(
                              item.price ?? 0
                            );

                      const quantity =
                        Number(
                          item.quantity ?? 1
                        );

                      const itemSubtotal =
                        finalPrice * quantity;

                      const hasDiscount =
                        finalPrice <
                        originalPrice;

                      return (
                        <tr key={index}>

                          <td>

                            <div className="product-name">
                              {item.name}
                            </div>

                            {hasDiscount && (
                              <div>

                                <span className="old-price">
                                  ৳ {originalPrice}
                                </span>

                                <span className="discounted-price">
                                  ৳ {finalPrice}
                                </span>

                              </div>
                            )}

                          </td>


                          <td>
                            ৳ {finalPrice}
                          </td>


                          <td>
                            {quantity}
                          </td>


                          <td>
                            ৳ {itemSubtotal}
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </section>


            {/* PAYMENT + TOTAL */}

            <section className="bottom-section">

              <div>

                <div className="payment-box">

                  <h3 className="payment-title">
                    PAYMENT METHOD
                  </h3>

                  <p className="payment-line">
                    Method: {paymentMethod}
                  </p>

                  <p className="payment-line">
                    Transaction ID:{" "}
                    {transactionId}
                  </p>

                  <p className="payment-line">
                    Status: {status}
                  </p>

                </div>


                <p className="terms">
                  *Please keep this invoice
                  for your records. Payment
                  and delivery details shown
                  above are based on the order
                  information provided at
                  checkout.
                </p>

              </div>


              {/* PRICE SUMMARY */}

              <div className="totals-box">

                {/* Original Price */}

                <div className="total-row">

                  <span>
                    Original Price
                  </span>

                  <span>
                    ৳ {originalTotal}
                  </span>

                </div>


                {/* Discount */}

                <div className="total-row discount-row">

                  <span>
                    Discount
                  </span>

                  <span className="discount-amount">
                    - ৳ {discountAmount}
                  </span>

                </div>


                {/* Discounted Price */}

                <div className="total-row">

                  <span>
                    Discounted Price
                  </span>

                  <span className="discounted-total">
                    ৳ {discountedTotal}
                  </span>

                </div>


                {/* Divider */}

                <div className="total-divider" />


                {/* Subtotal */}

                <div className="total-row">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ৳ {subtotal}
                  </span>

                </div>


                {/* Delivery Fee */}

                <div className="total-row">

                  <span>
                    Delivery Fee
                  </span>

                  <span>
                    ৳ {deliveryFee}
                  </span>

                </div>


                {/* Divider */}

                <div className="total-divider" />


                {/* TOTAL */}

                <div className="total-row grand-total">

                  <span>
                    TOTAL
                  </span>

                  <span>
                    ৳ {total}
                  </span>

                </div>

              </div>

            </section>


            {/* ACKNOWLEDGEMENT */}

            <section className="acknowledgement">

              <h3 className="acknowledgement-title">
                ACKNOWLEDGEMENT OF RECEIPT
              </h3>

              <p>
                This invoice confirms that
                your order has been
                successfully received by
                Tawakkul Zone.
              </p>

              <p>
                Please retain this invoice
                as proof of your order and
                payment information.
              </p>

            </section>


            {/* SIGNATURE SECTION */}

            <section className="signature-section">

              {/* CUSTOMER */}

              <div className="signature">

                <div className="signature-line">

                  <span className="customer-signature">
                    {customerName}
                  </span>

                </div>

                <p className="signature-label">
                  Customer Signature
                </p>

                <p className="signature-date">
                  {createdAt}
                </p>

              </div>


              {/* TAWAKKUL ZONE */}

              <div className="signature">

                <div className="signature-line">

                  <p className="signature-label">
                    Authorized Person
                  </p>

                </div>

                <span className="company-signature">
                  Tawakkul Zone
                </span>

                <p className="signature-date">
                  {createdAt}
                </p>

              </div>

            </section>


            {/* THANK YOU */}

            <div className="thank-you">
              Thank you for shopping with
              Tawakkul Zone ❤️
            </div>

          </div>

        </div>


        {/* =========================
            BUTTONS
        ========================= */}

        <div className="invoice-actions">

          <PrintInvoiceButton />

          <Link
            href="/"
            className="invoice-action home-button"
          >
            🏠 Home
          </Link>

          <Link
            href="/dashboard"
            className="invoice-action dashboard-button"
          >
            📊 Dashboard
          </Link>

        </div>

      </main>
    </>
  );
}