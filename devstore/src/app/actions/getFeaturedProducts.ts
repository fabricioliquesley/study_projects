"use server";

import { api } from "@/lib/api";
import { Product } from "@/types";

export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await api("/products/featured");
  const products = await response.json();
  return products;
}
