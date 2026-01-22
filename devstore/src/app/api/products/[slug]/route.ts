import z from "zod";
import data from "../data.json";

interface ProductParams {
  params: Promise<{
    slug: string;
  }>;
}

export const GET = async (_request: Request, { params }: ProductParams) => {
  const slug = z.string().parse((await params).slug);

  const product = data.products.find((product) => product.slug === slug);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(product);
};
