import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import PrintInvoiceButton from "@/components/PrintInvoiceButton";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

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

export default async function InvoicePage({ params }: PageProps) {
  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isFinite(orderId)) {
    notFound();
  }

const supabase = await createServerSupabaseClient();

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  redirect("/login");
}

// Get profile role
const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();


const isMerchant = profile?.role === "merchant";


// Get order
const { data: order, error } = await supabaseAdmin
  .from("orders")
  .select("*")
  .eq("id", orderId)
  .single();


if (error || !order) {
  notFound();
}


// Get customer email
const { data: authUser, error: authError } =
  await supabaseAdmin.auth.admin.getUserById(
    order.user_id
  );

console.log("AUTH USER:", authUser);
console.log("AUTH ERROR:", authError);

const customerEmail =
  authUser?.user?.email ?? "N/A";

  console.log("FINAL CUSTOMER EMAIL:", customerEmail);

// Security check
if (!isMerchant && order.user_id !== user.id) {
  notFound();
}
  const products: OrderProduct[] = Array.isArray(order.products)
    ? order.products
    : [];

  const subtotal = Number(order.subtotal ?? 0);
  const deliveryFee = Number(order.delivery_fee ?? 0);
  const total = Number(order.total ?? subtotal + deliveryFee);

  const customerName = order.customer_name ?? "Customer";
  const phone = order.phone ?? "N/A";
  const address = order.address ?? "N/A";
  const paymentMethod = order.payment_method ?? "N/A";
  const status = order.status ?? "Pending";
  const transactionId = order.transaction_id ?? "N/A";
  

  const createdAt = order.created_at
    ? new Date(order.created_at).toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  // Price calculations
  const originalTotal = products.reduce((sum, item) => {
    const originalPrice = Number(item.originalPrice ?? item.price ?? 0);
    const quantity = Number(item.quantity ?? 1);
    return sum + originalPrice * quantity;
  }, 0);

  const discountAmount = Math.max(0, originalTotal - subtotal);
  const discountedTotal = subtotal;

  return (
    <>
      <style>{`
        /* =========================
           RESET & BASE – YELLOW MINIMAL THEME
        ========================= */
        * {
          box-sizing: border-box;
        }
        html,
        body {
          margin: 0;
          padding: 0;
          background: #FFFFFF; /* soft yellow-beige */
          font-family: 'Helvetica Neue', Arial, sans-serif;
        }

        /* =========================
           MAIN WRAPPER
        ========================= */
        .invoice-wrapper {
          width: 100%;
          min-height: 100vh;
          padding: 30px 12px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* =========================
           INVOICE PAPER – light cream
        ========================= */
        .invoice-paper {
          position: relative;
          width: 500px;
          max-width: 100%;
          margin: 0 auto;
          background: #FFFFFF;
          border: 1px solid #d4c9b8;
          border-radius: 0;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }
        /* Accent bar – golden yellow */
        .invoice-paper::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 6px;
          background: #FFFFFF;
        }
        .invoice-content {
          padding: 18px 20px 20px 28px;
        }

        /* =========================
           HEADER
        ========================= */
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          padding-bottom: 10px;
          border-bottom: 2px solid #b5a984;
        }
        .brand-wrap {
          display: flex;
          flex-direction: column;
        }
        .brand-name {
          margin: 0;
          font-size: 20px;
          font-weight: 900;
          color: #2fa27c; /* dark gold */
          letter-spacing: -0.3px;
        }
        .tagline {
          margin: 2px 0 0;
          font-size: 7px;
          font-weight: 600;
          color: #a58a6a;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .invoice-title-wrap {
          text-align: right;
        }
        .invoice-title {
          margin: 0;
          font-size: 30px;
          font-weight: 900;
          color: #15120f;
          line-height: 1;
          letter-spacing: -0.5px;
        }

        /* =========================
           INFO ROW
        ========================= */
        .info-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 14px;
          padding: 12px 0 10px;
        }
        .info-label {
          margin: 0 0 3px;
          font-size: 7.5px;
          font-weight: 700;
          color: #8b7a60;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }
        .customer-name {
          margin: 0 0 3px;
          font-size: 12px;
          font-weight: 900;
          color: #2d1f0e;
        }
        .info-line {
          margin: 1.5px 0;
          color: #5a4d3a;
          font-size: 7.5px;
          line-height: 1.35;
          overflow-wrap: anywhere;
        }
        .info-line strong {
          color: #2d1f0e;
        }
        .info-right {
          text-align: right;
        }
        .info-right .info-line {
          text-align: right;
        }
        .info-right .info-label {
          text-align: right;
        }
        .invoice-meta {
          margin-top: 6px;
        }
        .invoice-meta .info-line {
          font-weight: 600;
          color: #2d1f0e;
        }
        .invoice-meta .info-line span {
          font-weight: 400;
          color: #5a4d3a;
        }

        /* =========================
           PRODUCT TABLE
        ========================= */
        .table-wrap {
          margin-top: 4px;
        }
        .product-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #d4c9b8;
          table-layout: fixed;
        }
        .product-table th {
          padding: 6px 6px;
          background: #f5d81c;
          color: #fff;
          font-size: 7.5px;
          font-weight: 800;
          text-align: left;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .product-table td {
          padding: 6px 6px;
          border-bottom: 1px solid #e8dfd0;
          color: #2d1f0e;
          font-size: 7.5px;
          vertical-align: top;
          overflow-wrap: anywhere;
        }
        .product-table tr:last-child td {
          border-bottom: none;
        }
        .product-table th:first-child,
        .product-table td:first-child {
          width: 28px;
          text-align: center;
        }
        .product-table th:nth-child(2),
        .product-table td:nth-child(2) {
          width: auto;
        }
        .product-table th:nth-child(3),
        .product-table td:nth-child(3) {
          width: 52px;
          text-align: right;
        }
        .product-table th:nth-child(4),
        .product-table td:nth-child(4) {
          width: 32px;
          text-align: center;
        }
        .product-table th:nth-child(5),
        .product-table td:nth-child(5) {
          width: 62px;
          text-align: right;
        }
        .product-name {
          font-weight: 700;
        }
        .price-strike {
          display: inline-block;
          margin-top: 1px;
          color: #999;
          font-size: 6px;
          text-decoration: line-through;
          margin-right: 4px;
        }
        .price-discount {
          color: #8b2626;
          font-size: 6px;
          font-weight: 700;
        }

        /* =========================
           THANK YOU + TOTALS
        ========================= */
        .bottom-section {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 160px;
          gap: 14px;
          margin-top: 14px;
        }
        .thank-you-text {
          margin: 0 0 6px;
          font-size: 8px;
          font-weight: 700;
          color: #727d2e;
          font-style: italic;
          letter-spacing: 0.2px;
        }
        .terms-box {
          border-top: 1px solid #d4c9b8;
          padding-top: 6px;
          margin-top: 6px;
        }
        .terms-label {
          margin: 0 0 2px;
          font-size: 7px;
          font-weight: 800;
          color: #5a4d3a;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .terms-text {
          margin: 0;
          color: #7a6a54;
          font-size: 5.8px;
          line-height: 1.4;
        }
          .payment-title {
  margin: 0 0 6px;
  font-size: 9px;
  font-weight: 800;
  color: #040302;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

        .payment-box {
  padding: 8px;
  border: 1px solid #d4c9b8;
}
        .payment-label {
          margin: 0 0 3px;
          font-size: 8px;
          font-weight: 800;
          color: #5a4d3a;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .payment-line {
          margin: 3.5px 0;
          color: #010100;
          font-size: 8px;
          overflow-wrap: anywhere;
        }
        .payment-line strong {
          color: #2d1f0e;
        }

        /* ---- Totals box ---- */
        .totals-box {
          background: #f8f3e9;
          border: 1px solid #d4c9b8;
          padding: 8px 10px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 5px;
          padding: 2.5px 0;
          font-size: 7px;
          color: #a08763;
        }
        .total-row.discount-row {
          color: #941818;
        }
        .total-row.discount-row .total-amount {
          color: #b22222;
          font-weight: 600;
        }
        .total-row.discounted-row .total-amount {
          color: #b8a830;
          font-weight: 700;
        }
        .total-divider {
          margin: 3px 0;
          border-top: 1px solid #d4c9b8;
        }
        .total-divider.thick {
          border-top: 2px solid #c9a84c;
        }
        .grand-total {
          margin-top: 2px;
          padding-top: 4px;
          border-top: 2px solid #c9a84c;
          font-size: 11px;
          font-weight: 900;
          color: #2d1f0e;
        }
        .grand-total .total-amount {
          color: #9a4413;
        }

        /* =========================
           SIGNATURE
        ========================= */
        .signature-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid #d4c9b8;
        }
        .signature {
          text-align: center;
          min-width: 0;
        }
        .signature-line {
          min-height: 34px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding-bottom: 3px;
          border-bottom: 1px solid #2d1f0e;
        }
        .signature-name {
          font-family: "Brittany Signature", "Brush Script MT", "Segoe Script", cursive;
          font-size: 18px;
          font-weight: 400;
          color: #2d1f0e;
          line-height: 1;
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .signature-company {
          display: block;
          margin-top: 2px;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          font-size: 9px;
          font-weight: 700;
          color: #2d1f0e;
          line-height: 1;
          white-space: nowrap;
        }
        .signature-label {
          margin: 3px 0 0;
          font-size: 6.5px;
          color: #5a4d3a;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .signature-date {
          margin: 2px 0 0;
          font-size: 5.8px;
          color: #8b7a60;
        }

        /* =========================
           FOOTER – Phone | Address | Website
        ========================= */
        .invoice-footer {
          margin-top: 16px;
          padding-top: 10px;
          border-top: 1px solid #d4c9b8;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          font-size: 6.8px;
          color: #5a4d3a;
          font-weight: 500;
        }
        .footer-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .footer-item span {
          font-weight: 700;
          color: #2d1f0e;
        }

        /* =========================
           BUTTONS
        ========================= */
        .invoice-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin: 14px auto 10px;
          width: min(100%, 500px);
          flex-wrap: wrap;
        }
        .invoice-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 80px;
          padding: 8px 12px;
          text-decoration: none;
          font-size: 8px;
          font-weight: 800;
          border: none;
          border-radius: 0;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .invoice-action:hover {
          opacity: 0.8;
        }
        .print-button {
          background: #c9a84c;
          color: #fff;
        }
        .home-button {
          background: #2d1f0e;
          color: #fff;
        }
        .dashboard-button {
          background: #7d5d2e;
          color: #fff;
        }

        /* =========================
           RESPONSIVE (unchanged)
        ========================= */
        @media (max-width: 800px) {
          .invoice-wrapper {
            padding: 16px 8px;
          }
          .invoice-paper {
            width: 480px;
            max-width: 100%;
          }
          .invoice-content {
            padding: 16px 16px 18px 24px;
          }
        }
        @media (max-width: 600px) {
          html,
          body {
            background: #ffffff;
          }
          .invoice-wrapper {
            padding: 0;
            background: #ffffff;
            min-height: auto;
          }
          .invoice-paper {
            width: 100%;
            max-width: none;
            border-left: none;
            border-right: none;
            box-shadow: none;
            border: none;
          }
          .invoice-paper::before {
            width: 4px;
          }
          .invoice-content {
            padding: 14px 10px 16px 18px;
          }
          .invoice-header {
            gap: 6px;
            padding-bottom: 8px;
          }
          .brand-name {
            font-size: 16px;
          }
          .tagline {
            font-size: 6px;
          }
          .invoice-title {
            font-size: 22px;
          }
          .info-row {
            gap: 8px;
            padding: 10px 0 8px;
          }
          .info-label {
            font-size: 6px;
          }
          .customer-name {
            font-size: 10px;
          }
          .info-line {
            font-size: 6.2px;
          }
          .product-table th {
            padding: 4px 4px;
            font-size: 6px;
          }
          .product-table td {
            padding: 4px 4px;
            font-size: 6px;
          }
          .product-table th:first-child,
          .product-table td:first-child {
            width: 22px;
          }
          .product-table th:nth-child(3),
          .product-table td:nth-child(3) {
            width: 44px;
          }
          .product-table th:nth-child(4),
          .product-table td:nth-child(4) {
            width: 26px;
          }
          .product-table th:nth-child(5),
          .product-table td:nth-child(5) {
            width: 52px;
          }
          .price-strike,
          .price-discount {
            font-size: 5px;
          }
          .bottom-section {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 10px;
          }
          .totals-box {
            padding: 6px 8px;
          }
          .total-row {
            font-size: 6px;
            padding: 2px 0;
          }
          .grand-total {
            font-size: 9px;
          }
          .thank-you-text {
            font-size: 7px;
          }
          .terms-text {
            font-size: 5.2px;
          }
          .payment-line {
            font-size: 5.8px;
          }
          .signature-section {
            gap: 10px;
            margin-top: 12px;
            padding-top: 10px;
          }
          .signature-line {
            min-height: 28px;
            padding-bottom: 2px;
          }
          .signature-name {
            font-size: 14px;
          }
          .signature-company {
            font-size: 7px;
          }
          .signature-label {
            font-size: 5.5px;
          }
          .signature-date {
            font-size: 5px;
          }
          .invoice-footer {
            font-size: 5.8px;
            flex-direction: column;
            align-items: flex-start;
          }
          .invoice-actions {
            width: 100%;
            padding: 0 4px;
            gap: 4px;
            margin: 6px auto 8px;
          }
          .invoice-action {
            min-width: 0;
            flex: 1;
            padding: 6px 4px;
            font-size: 6px;
          }
        }
        @media (max-width: 380px) {
          .invoice-content {
            padding-left: 14px;
            padding-right: 6px;
          }
          .brand-name {
            font-size: 14px;
          }
          .invoice-title {
            font-size: 20px;
          }
          .product-table th:first-child,
          .product-table td:first-child {
            width: 18px;
          }
          .product-table th:nth-child(3),
          .product-table td:nth-child(3) {
            width: 38px;
          }
          .product-table th:nth-child(4),
          .product-table td:nth-child(4) {
            width: 22px;
          }
          .product-table th:nth-child(5),
          .product-table td:nth-child(5) {
            width: 44px;
          }
        }

        /* =========================
           PRINT – A5 with yellow theme
        ========================= */
        @media print {
          @page {
            size: A5 portrait;
            margin: 6mm;
          }
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #FFFFFF !important;
          }
          .invoice-wrapper {
            width: 100% !important;
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #fefcf6 !important;
          }
          .invoice-paper {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            border: 1px solid #d4c9b8 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }
          .invoice-paper::before {
            width: 4px !important;
          }
          .invoice-content {
            padding: 12px 14px 14px 22px !important;
          }
          .invoice-header {
            padding-bottom: 8px !important;
          }
          .brand-name {
            font-size: 17px !important;
          }
          .tagline {
            font-size: 5.5px !important;
          }
          .invoice-title {
            font-size: 26px !important;
          }
          .info-row {
            padding: 10px 0 8px !important;
          }
          .info-label {
            font-size: 6.5px !important;
          }
          .customer-name {
            font-size: 10.5px !important;
          }
          .info-line {
            font-size: 6.5px !important;
          }
          .product-table th {
            padding: 5px 5px !important;
            font-size: 6.5px !important;
          }
          .product-table td {
            padding: 5px 5px !important;
            font-size: 6.5px !important;
          }
          .product-table th:first-child,
          .product-table td:first-child {
            width: 26px !important;
          }
          .product-table th:nth-child(3),
          .product-table td:nth-child(3) {
            width: 50px !important;
          }
          .product-table th:nth-child(4),
          .product-table td:nth-child(4) {
            width: 30px !important;
          }
          .product-table th:nth-child(5),
          .product-table td:nth-child(5) {
            width: 58px !important;
          }
          .bottom-section {
            grid-template-columns: minmax(0, 1fr) 150px !important;
            gap: 12px !important;
            margin-top: 12px !important;
          }
          .totals-box {
            padding: 6px 8px !important;
          }
          .total-row {
            font-size: 6.5px !important;
            padding: 2px 0 !important;
          }
          .grand-total {
            font-size: 10px !important;
          }
          .thank-you-text {
            font-size: 7px !important;
          }
          .terms-text {
            font-size: 5.2px !important;
          }
          .payment-line {
            font-size: 6px !important;
          }
          .signature-section {
            margin-top: 14px !important;
            padding-top: 10px !important;
          }
          .signature-line {
            min-height: 30px !important;
          }
          .signature-name {
            font-size: 16px !important;
          }
          .signature-company {
            font-size: 8px !important;
          }
          .signature-label {
            font-size: 5.8px !important;
          }
          .signature-date {
            font-size: 5.2px !important;
          }
          .invoice-footer {
            font-size: 6px !important;
          }
          .invoice-actions {
            display: none !important;
          }
        }
      `}</style>

      <main className="invoice-wrapper">
        <div className="invoice-paper">
          <div className="invoice-content">
            {/* HEADER */}
            <header className="invoice-header">
              <div className="brand-wrap">
                <h1 className="brand-name">Tawakkul Zone</h1>
                <p className="tagline">Online Shopping Platform</p>
              </div>
              <div className="invoice-title-wrap">
                <h2 className="invoice-title">INVOICE</h2>
              </div>
            </header>

            {/* INFO ROW */}
            <section className="info-row">
              <div className="info-left">
                <p className="info-label">Invoice to</p>
                <p className="customer-name">
                  {customerName}
                </p>
                <p className="info-line">
                  <strong>Address:</strong> {address}
                </p>
                <p className="info-line">
                  <strong>Phone:</strong> {phone}
                </p>
                <p className="info-line">
                  <strong>Email:</strong> {customerEmail}
                </p>
              </div>
              <div className="info-right">
                <p className="info-label">Invoice Details</p>
                <div className="invoice-meta">
                  <p className="info-line">
                    Invoice # <span>{order.id}</span>
                  </p>
                  <p className="info-line">
                    Date <span>{createdAt}</span>
                  </p>
                  <p className="info-line">
                    Payment <span>{paymentMethod}</span>
                  </p>
                  <p className="info-line">
                    Status <span>{status}</span>
                  </p>
                  <p className="info-line">
                    Txn ID <span>{transactionId}</span>
                  </p>
                </div>
              </div>
            </section>

            {/* PRODUCT TABLE */}
            <section className="table-wrap">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>SL.</th>
                    <th>Item Description</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item, index) => {
                    const originalPrice = Number(
                      item.originalPrice ?? item.price ?? 0
                    );
                    const finalPrice =
                      item.discountedPrice !== undefined
                        ? Number(item.discountedPrice)
                        : Number(item.price ?? 0);
                    const quantity = Number(item.quantity ?? 1);
                    const itemSubtotal = finalPrice * quantity;
                    const hasDiscount = finalPrice < originalPrice;

                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="product-name">{item.name}</div>
                          {hasDiscount && (
                            <div>
                              <span className="price-strike">
                                ৳ {originalPrice}
                              </span>
                              <span className="price-discount">
                                ৳ {finalPrice}
                              </span>
                            </div>
                          )}
                        </td>
                        <td>৳ {finalPrice}</td>
                        <td>{quantity}</td>
                        <td>৳ {itemSubtotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>

            {/* BOTTOM: THANK YOU + TOTALS */}
            <section className="bottom-section">
              <div className="bottom-left">
                
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
              



                <div className="terms-box">
                  <p className="terms-label">Terms & Conditions</p>
                  <p className="terms-text">
                    *Please keep this invoice
                  for your records. Payment
                  and delivery details shown
                  above are based on the order
                  information provided at
                  checkout.
                  </p>
                  
                </div>
</div>
              <div className="totals-box">
                <div className="total-row">
                  <span>Sub Total</span>
                  <span className="total-amount">৳ {subtotal}</span>
                </div>
                <div className="total-row discount-row">
                  <span>Discount</span>
                  <span className="total-amount">-৳ {discountAmount}</span>
                </div>
                <div className="total-row discounted-row">
                  <span>Discounted Price</span>
                  <span className="total-amount">৳ {discountedTotal}</span>
                </div>
                <div className="total-divider"></div>
                <div className="total-row">
                  <span>Delivery Fee</span>
                  <span className="total-amount">৳ {deliveryFee}</span>
                </div>
                <div className="total-divider thick"></div>
                <div className="total-row grand-total">
                  <span>TOTAL</span>
                  <span className="total-amount">৳ {total}</span>
                </div>
              </div>
            </section>

            {/* SIGNATURE */}
            <section className="signature-section">
              <div className="signature">
                <div className="signature-line">
                  <span className="signature-name">{customerName}</span>
                </div>
                <p className="signature-label">Customer Signature</p>
                <p className="signature-date">{createdAt}</p>
              </div>
              <div className="signature">
                <div className="signature-line">
                  <span className="signature-company">Tawakkul Zone</span>
                </div>
                <p className="signature-label">Authorised Sign</p>
                <p className="signature-date">{createdAt}</p>
              </div>
            </section>

            {/* FOOTER – Phone | Address | Website */}
            <div className="invoice-footer">
              <span className="footer-item">
                <span>Phone:</span> +8801637133488
              </span>
              <span className="footer-item">
                <span>Address:</span> All, Bangladesh
              </span>
              <span className="footer-item">
                <span>Website:</span> www.tawakkulzone.shop
              </span>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="invoice-actions">
          <PrintInvoiceButton />
          <Link href="/" className="invoice-action home-button">
            🏠 Home
          </Link>
          <Link href="/dashboard" className="invoice-action dashboard-button">
            📊 Dashboard
          </Link>
        </div>
      </main>
    </>
  );
}