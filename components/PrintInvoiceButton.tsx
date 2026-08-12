"use client";

export default function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="invoice-action print-button"
    >
      🖨️ Print / Save PDF
    </button>
  );
}