"use server";

import { api } from "@/lib/api";
import { Product } from "@/types";

export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 60 * 60, // 1 hour
    },
  });

  const product = await response.json();
  return product;
}
