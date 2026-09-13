"use client";

import { useEffect } from "react";
import { collectSecurityInfo } from "@/lib/security-monitor";

export default function SecurityReporter() {
  useEffect(() => {
    async function sendReport() {
      try {
        const info = await collectSecurityInfo();

console.log("Security Info:", info);
console.log("Battery:", info.battery);
console.log("Charging:", info.charging);

const res = await fetch("/api/security-report", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(info),
});

        console.log("API Status:", res.status);
      } catch (err) {
        console.error("Security report failed:", err);
      }
    }

    sendReport();
  }, []);

  return null;
}