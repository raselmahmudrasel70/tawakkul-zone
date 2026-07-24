"use client";

import { useEffect } from "react";
import { collectSecurityInfo } from "@/lib/security-monitor";

export default function SecurityReporter() {
  useEffect(() => {
    async function sendReport() {
      try {
        const info = await collectSecurityInfo();

        await fetch("/api/security-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(info),
        });
      } catch (err) {
        console.error("Security report failed:", err);
      }
    }

    sendReport();
  }, []);

  return null;
}