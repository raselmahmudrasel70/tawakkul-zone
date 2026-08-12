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

  /* =========================
     PRICE CALCULATIONS
  ========================= */

  const originalTotal = products.reduce(
    (sum, item) => {
      const originalPrice = Number(
        item.originalPrice ??
          item.price ??
          0
      );

      const quantity = Number(
        item.quantity ?? 1
      );

      return sum + originalPrice * quantity;
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

        /* =========================
           MAIN
        ========================= */

        .invoice-wrapper {
          width: 100%;
          min-height: 100vh;
          padding: 20px 10px;
          background: #f3f4f6;
        }

        /* =========================
           COMPACT INVOICE
        ========================= */

        .invoice-paper {
          position: relative;

          width: 470px;
          max-width: 100%;

          margin: 0 auto;

          zoom: 1.05;

          background: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 0;
          overflow: hidden;

          box-shadow:
            0 4px 14px rgba(0, 0, 0, 0.08);
        }

        .invoice-paper::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          background: #8ed05c;
        }

        .invoice-content {
          padding: 17px 17px 19px 23px;
        }

        /* =========================
           HEADER
        ========================= */

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          padding-bottom: 11px;
          border-bottom: 1px solid #222;
        }

        .brand-name {
          margin: 0 0 4px;
          font-size: 18px;
          font-weight: 900;
          color: #087f3e;
        }

        .invoice-title {
          margin: 0;
          font-size: 27px;
          line-height: 1;
          font-weight: 900;
          color: #111;
          text-align: right;
        }

        .invoice-number {
          margin-top: 4px;
          color: #555;
          font-size: 8px;
          line-height: 1.45;
        }

        /* =========================
           CUSTOMER / COMPANY
        ========================= */

        .info-section {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);
          gap: 12px;
          padding: 12px 0 14px;
        }

        .info-title {
          margin: 0 0 4px;
          font-size: 8px;
          font-weight: 700;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.35px;
        }

        .customer-name {
          margin: 0 0 4px;
          font-size: 11.5px;
          font-weight: 900;
          color: #111;
        }

        .info-line {
          margin: 2px 0;
          color: #555;
          font-size: 7.5px;
          line-height: 1.3;
          overflow-wrap: anywhere;
        }

        .info-line strong {
          color: #222;
        }

        .order-info {
          text-align: right;
          min-width: 0;
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
          table-layout: fixed;
        }

        .product-table th {
          padding: 6px 5px;
          background: #48a941;
          color: white;
          font-size: 7.5px;
          font-weight: 800;
          text-align: left;
        }

        .product-table td {
          padding: 6px 5px;
          border-bottom: 1px solid #d1d5db;
          color: #222;
          font-size: 7.5px;
          vertical-align: top;
          overflow-wrap: anywhere;
        }

        .product-table th:first-child,
        .product-table td:first-child {
          width: auto;
        }

        .product-table th:nth-child(2),
        .product-table td:nth-child(2) {
          width: 60px;
          text-align: right;
        }

        .product-table th:nth-child(3),
        .product-table td:nth-child(3) {
          width: 34px;
          text-align: center;
        }

        .product-table th:nth-child(4),
        .product-table td:nth-child(4) {
          width: 68px;
          text-align: right;
        }

        .product-name {
          font-weight: 700;
        }

        .old-price {
          display: inline-block;
          margin-top: 2px;
          color: #777;
          font-size: 6px;
          text-decoration: line-through;
        }

        .discounted-price {
          margin-left: 3px;
          color: #087f3e;
          font-size: 6px;
          font-weight: 700;
        }

        /* =========================
           PAYMENT + TOTAL
        ========================= */

        .bottom-section {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            155px;
          gap: 10px;
          margin-top: 13px;
        }

        .payment-box {
          border: 1px solid #bdbdbd;
          border-radius: 0;
          padding: 8px;
        }

        .payment-title {
          margin: 0 0 4px;
          font-size: 7.5px;
          font-weight: 900;
          color: #444;
        }

        .payment-line {
          margin: 2px 0;
          color: #555;
          font-size: 6.8px;
          overflow-wrap: anywhere;
        }

        .terms {
          margin-top: 6px;
          color: #777;
          font-size: 6px;
          line-height: 1.35;
        }

        .totals-box {
          background: #eeeeee;
          border-radius: 0;
          padding: 8px 9px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 5px;
          padding: 3px 0;
          font-size: 7px;
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
          margin: 4px 0;
          border-top: 1px solid #9ca3af;
        }

        .grand-total {
          margin-top: 3px;
          padding-top: 5px;
          border-top: 1px solid #555;
          font-size: 11px;
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
          margin-top: 13px;
        }

        .acknowledgement-title {
          margin: 0 0 4px;
          font-size: 8.5px;
          font-weight: 900;
          color: #444;
        }

        .acknowledgement p {
          margin: 0 0 3px;
          color: #666;
          font-size: 6.8px;
          line-height: 1.35;
        }

        /* =========================
           SIGNATURE
        ========================= */

        .signature-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 17px;
        }

        .signature {
          text-align: center;
          min-width: 0;
        }

        .signature-line {
          min-height: 35px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 3px;
          border-bottom: 1px solid #222;
        }

        .customer-signature {
          font-family:
            "Brittany Signature",
            "Brush Script MT",
            "Segoe Script",
            cursive;
          font-size: 17px;
          font-weight: 400;
          color: #111;
          line-height: 1;
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .company-signature {
          display: block;
          margin-top: 3px;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
          font-size: 9px;
          font-weight: 700;
          color: #111;
          line-height: 1;
          white-space: nowrap;
        }

        .signature-label {
          margin: 3px 0 0;
          font-size: 6.5px;
          color: #222;
          font-weight: 500;
        }

        .signature-date {
          margin: 2px 0 0;
          font-size: 6px;
          color: #555;
        }

        .thank-you {
          margin-top: 9px;
          text-align: center;
          color: #555;
          font-size: 6.8px;
          font-weight: 600;
        }

        /* =========================
           BUTTONS
        ========================= */

        .invoice-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
          margin: 10px auto 15px;
          width: min(100%, 470px);
        }

        .invoice-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 90px;
          padding: 7px 9px;
          text-decoration: none;
          font-size: 8px;
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
           TABLET
        ========================= */

        @media (max-width: 800px) {
          .invoice-wrapper {
            padding: 12px 7px;
          }

          .invoice-paper {
            width: 470px;
            max-width: 100%;
            zoom: 1.03;
          }

          .invoice-content {
            padding: 16px 15px 18px 21px;
          }
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 600px) {
          html,
          body {
            background: #ffffff;
          }

          .invoice-wrapper {
            width: 100%;
            min-height: auto;
            padding: 0;
            background: #ffffff;
          }

          .invoice-paper {
            width: 100%;
            max-width: none;
            zoom: 1;
            border-left: none;
            border-right: none;
            box-shadow: none;
          }

          .invoice-paper::before {
            width: 4px;
          }

          .invoice-content {
            padding: 16px 10px 18px 16px;
          }

          .invoice-header {
            gap: 6px;
            padding-bottom: 8px;
          }

          .brand-name {
            font-size: 14px;
            margin-bottom: 3px;
          }

          .invoice-title {
            font-size: 21px;
          }

          .invoice-number {
            font-size: 6px;
            line-height: 1.35;
          }

          .info-section {
            gap: 7px;
            padding: 10px 0 11px;
          }

          .info-title {
            margin-bottom: 3px;
            font-size: 6px;
          }

          .customer-name {
            margin-bottom: 3px;
            font-size: 9px;
          }

          .info-line {
            margin: 1.5px 0;
            font-size: 6px;
            line-height: 1.25;
          }

          .product-table th {
            padding: 5px 3px;
            font-size: 6px;
          }

          .product-table td {
            padding: 5px 3px;
            font-size: 6px;
          }

          .product-table th:nth-child(2),
          .product-table td:nth-child(2) {
            width: 50px;
          }

          .product-table th:nth-child(3),
          .product-table td:nth-child(3) {
            width: 27px;
          }

          .product-table th:nth-child(4),
          .product-table td:nth-child(4) {
            width: 58px;
          }

          .old-price,
          .discounted-price {
            font-size: 5px;
          }

          .bottom-section {
            grid-template-columns:
              minmax(0, 1fr)
              120px;
            gap: 6px;
            margin-top: 10px;
          }

          .payment-box {
            padding: 5px;
          }

          .payment-title {
            margin-bottom: 3px;
            font-size: 6px;
          }

          .payment-line {
            font-size: 5.2px;
          }

          .terms {
            margin-top: 5px;
            font-size: 4.8px;
            line-height: 1.25;
          }

          .totals-box {
            padding: 6px;
          }

          .total-row {
            gap: 3px;
            padding: 2px 0;
            font-size: 6px;
          }

          .total-divider {
            margin: 3px 0;
          }

          .grand-total {
            margin-top: 2px;
            padding-top: 4px;
            font-size: 9px;
          }

          .acknowledgement {
            margin-top: 10px;
          }

          .acknowledgement-title {
            margin-bottom: 3px;
            font-size: 7px;
          }

          .acknowledgement p {
            margin-bottom: 2px;
            font-size: 5.5px;
            line-height: 1.25;
          }

          .signature-section {
            gap: 8px;
            margin-top: 14px;
          }

          .signature-line {
            min-height: 32px;
            padding-bottom: 2px;
          }

          .customer-signature {
            font-size: 14px;
          }

          .company-signature {
            margin-top: 2px;
            font-size: 6.5px;
          }

          .signature-label {
            margin-top: 2px;
            font-size: 5.2px;
          }

          .signature-date {
            margin-top: 1px;
            font-size: 5px;
          }

          .thank-you {
            margin-top: 7px;
            font-size: 5.5px;
          }

          .invoice-actions {
            width: 100%;
            padding: 0 4px;
            gap: 3px;
            margin: 5px auto 8px;
          }

          .invoice-action {
            min-width: 0;
            flex: 1;
            padding: 6px 3px;
            font-size: 6.5px;
          }
        }

        /* =========================
           VERY SMALL PHONES
        ========================= */

        @media (max-width: 380px) {
          .invoice-content {
            padding-left: 14px;
            padding-right: 7px;
          }

          .invoice-title {
            font-size: 20px;
          }

          .brand-name {
            font-size: 13px;
          }

          .bottom-section {
            grid-template-columns:
              minmax(0, 1fr)
              112px;
          }

          .product-table th:nth-child(2),
          .product-table td:nth-child(2) {
            width: 47px;
          }

          .product-table th:nth-child(3),
          .product-table td:nth-child(3) {
            width: 25px;
          }

          .product-table th:nth-child(4),
          .product-table td:nth-child(4) {
            width: 55px;
          }
        }

        /* =========================
           A5 PRINT
        ========================= */

        @media print {
          @page {
            size: A5 portrait;
            margin: 7mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }

          .invoice-wrapper {
            width: 100% !important;
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
          }

          /*
           * A5:
           * 148mm × 210mm
           *
           * Invoice compact থাকবে এবং
           * page-এর মাঝখানে থাকবে।
           */
          .invoice-paper {
            width: 470px !important;
            max-width: 470px !important;

            zoom: 1 !important;

            margin: 0 auto !important;

            border: 1px solid #d1d5db !important;
            border-radius: 0 !important;

            box-shadow: none !important;

            page-break-inside: avoid;
          }

          .invoice-paper::before {
            width: 4px !important;
          }

          .invoice-content {
            padding: 14px 14px 16px 20px !important;
          }

          .invoice-header {
            gap: 8px !important;
            padding-bottom: 8px !important;
          }

          .brand-name {
            font-size: 16px !important;
            margin-bottom: 3px !important;
          }

          .invoice-title {
            font-size: 24px !important;
          }

          .invoice-number {
            margin-top: 3px !important;
            font-size: 6.8px !important;
            line-height: 1.35 !important;
          }

          .info-section {
            gap: 10px !important;
            padding: 9px 0 10px !important;
          }

          .info-title {
            margin-bottom: 3px !important;
            font-size: 7px !important;
          }

          .customer-name {
            margin-bottom: 3px !important;
            font-size: 10px !important;
          }

          .info-line {
            margin: 1.5px 0 !important;
            font-size: 6.5px !important;
            line-height: 1.25 !important;
          }

          .product-table th {
            padding: 5px 4px !important;
            font-size: 6.8px !important;
          }

          .product-table td {
            padding: 5px 4px !important;
            font-size: 6.8px !important;
          }

          .product-table th:nth-child(2),
          .product-table td:nth-child(2) {
            width: 58px !important;
          }

          .product-table th:nth-child(3),
          .product-table td:nth-child(3) {
            width: 32px !important;
          }

          .product-table th:nth-child(4),
          .product-table td:nth-child(4) {
            width: 64px !important;
          }

          .old-price,
          .discounted-price {
            font-size: 5.5px !important;
          }

          .bottom-section {
            grid-template-columns:
              minmax(0, 1fr)
              145px !important;

            gap: 8px !important;

            margin-top: 10px !important;
          }

          .payment-box {
            padding: 7px !important;
          }

          .payment-title {
            margin-bottom: 3px !important;
            font-size: 7px !important;
          }

          .payment-line {
            margin: 1.5px 0 !important;
            font-size: 6px !important;
          }

          .terms {
            margin-top: 5px !important;
            font-size: 5.3px !important;
            line-height: 1.25 !important;
          }

          .totals-box {
            padding: 7px 8px !important;
          }

          .total-row {
            padding: 2.5px 0 !important;
            font-size: 6.5px !important;
          }

          .total-divider {
            margin: 3px 0 !important;
          }

          .grand-total {
            margin-top: 2px !important;
            padding-top: 4px !important;
            font-size: 10px !important;
          }

          .acknowledgement {
            margin-top: 10px !important;
          }

          .acknowledgement-title {
            margin-bottom: 3px !important;
            font-size: 7.5px !important;
          }

          .acknowledgement p {
            margin-bottom: 2px !important;
            font-size: 6px !important;
            line-height: 1.25 !important;
          }

          .signature-section {
            gap: 14px !important;
            margin-top: 13px !important;
          }

          .signature-line {
            min-height: 30px !important;
            padding-bottom: 2px !important;
          }

          .customer-signature {
            font-size: 15px !important;
          }

          .company-signature {
            margin-top: 2px !important;
            font-size: 8px !important;
          }

          .signature-label {
            margin-top: 2px !important;
            font-size: 5.8px !important;
          }

          .signature-date {
            margin-top: 1px !important;
            font-size: 5.5px !important;
          }

          .thank-you {
            margin-top: 7px !important;
            font-size: 6px !important;
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

              {/* TOTALS */}

              <div className="totals-box">

                <div className="total-row">

                  <span>
                    Original Price
                  </span>

                  <span>
                    ৳ {originalTotal}
                  </span>

                </div>

                <div className="total-row discount-row">

                  <span>
                    Discount
                  </span>

                  <span className="discount-amount">
                    - ৳ {discountAmount}
                  </span>

                </div>

                <div className="total-row">

                  <span>
                    Discounted Price
                  </span>

                  <span className="discounted-total">
                    ৳ {discountedTotal}
                  </span>

                </div>

                <div className="total-divider" />

                <div className="total-row">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ৳ {subtotal}
                  </span>

                </div>

                <div className="total-row">

                  <span>
                    Delivery Fee
                  </span>

                  <span>
                    ৳ {deliveryFee}
                  </span>

                </div>

                <div className="total-divider" />

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

            {/* SIGNATURE */}

            <section className="signature-section">

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

        {/* BUTTONS */}

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