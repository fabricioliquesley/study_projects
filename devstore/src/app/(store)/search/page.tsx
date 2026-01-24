import { getProductsByName } from "@/app/actions/getProductsByName";
import { Product } from "@/components/product";
import { ProductBadge } from "@/components/product/badge";
import { formatPrice } from "@/lib/price";
import { redirect } from "next/navigation";

interface SearchProps {
  searchParams: Promise<{ q: string }>;
}

export default async function SearchPage({ searchParams }: SearchProps) {
  const { q: query } = await searchParams;

  if (!query) {
    redirect("/");
  }

  const products = await getProductsByName(query);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">{query}</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <Product
            key={product.id}
            href={`/product/${product.slug}`}
            src={product.image}
            alt={product.title}
          >
            <ProductBadge
              title={product.title}
              price={formatPrice(product.price)}
              className="right-10 bottom-10"
            />
          </Product>
        ))}
      </div>
    </div>
  );
}
