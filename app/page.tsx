"use client";

import { useState } from "react";

import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <>
      <Hero />

      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <FeaturedProducts
        selectedCategory={selectedCategory}
      />

      <Footer />
    </>
  );
}