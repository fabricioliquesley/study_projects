"use server";

import { api } from "@/lib/api";
import { Product } from "@/types";

export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await api("/products/featured", {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  });
  const products = await response.json();
  return products;
}
