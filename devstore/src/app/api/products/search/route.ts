import z from "zod";
import data from "../data.json";
import type { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = request.nextUrl;

  const query = z.string().parse(searchParams.get("q"));

  const products = data.products.filter((product) =>
    product.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );

  if (products.length === 0) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(products);
};
