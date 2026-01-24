"use server";

import { api } from "@/lib/api";
import { Product } from "@/types";

export async function getProductsByName(name: string): Promise<Product[]> {
  const response = await api(`/products/search?q=${name}`, {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  });

  const products = await response.json();
  return products;
}
