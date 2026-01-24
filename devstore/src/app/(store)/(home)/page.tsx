import { getFeaturedProducts } from "@/app/actions/getFeaturedProducts";
import { Product } from "@/components/product";
import { ProductBadge } from "@/components/product/badge";
import { formatPrice } from "@/lib/price";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const [highlightedProduct, ...otherProducts] = await getFeaturedProducts();

  return (
    <div className="grid max-h-[860px] grid-cols-9 grid-rows-6 gap-6">
      <Product
        href={`/product/${highlightedProduct.slug}`}
        src={highlightedProduct.image}
        alt={highlightedProduct.title}
        className="col-span-6 row-span-6"
      >
        <ProductBadge
          title={highlightedProduct.title}
          price={formatPrice(highlightedProduct.price)}
          className="right-28 bottom-28"
        />
      </Product>
      {otherProducts.map((product) => (
        <Product
          key={product.id}
          href={`/product/${product.slug}`}
          src={product.image}
          alt={product.title}
          className="col-span-3 row-span-3"
        >
          <ProductBadge
            title={product.title}
            price={formatPrice(product.price)}
            className="bottom-10 mx-auto"
          />
        </Product>
      ))}
    </div>
  );
}
