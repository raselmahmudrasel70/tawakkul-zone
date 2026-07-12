export type Product = {
  id: number;

  name: string;

  slug: string;

  price: number;

  image: string;

  images: string[];

  category: string;

  description: string;

  rating: number;

  stock: boolean;

  featured: boolean;

  newArrival: boolean;

  freeDelivery: boolean;

  cashOnDelivery: boolean;

  discount: number;

  brand: string;

  sku: string;

  isActive: boolean;
};