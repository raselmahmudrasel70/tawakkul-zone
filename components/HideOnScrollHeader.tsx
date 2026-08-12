"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function HideOnScrollHeader() {
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // একদম উপরে থাকলে Header সবসময় দেখাবে
      if (currentScrollY <= 10) {
        setShowHeader(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Scroll Down
      if (currentScrollY > lastScrollY) {
        setShowHeader(false);
      }

      // Scroll Up
      else if (currentScrollY < lastScrollY) {
        setShowHeader(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <div
      className={`
        fixed
        left-0
        right-0
        top-0
        z-[9999]
        transition-transform
        duration-300
        ease-in-out
        ${
          showHeader
            ? "translate-y-0"
            : "-translate-y-full"
        }
      `}
    >
      <Header />
    </div>
  );
}