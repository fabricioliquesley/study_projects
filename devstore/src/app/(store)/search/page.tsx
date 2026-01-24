import { Product } from "@/components/product";
import { ProductBadge } from "@/components/product/badge";
import { formatPrice } from "@/lib/price";

export default function SearchPage() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">
        Resultados para: <span className="font-semibold">moletom</span>
      </p>

      <div className="grid grid-cols-3 gap-6">
        <Product
          href={`/product/moletom-never-stop-learning`}
          src={"/moletom-never-stop-learning.png"}
        >
          <ProductBadge
            title="Moletom Never Stop Learning"
            price={formatPrice(129)}
            className="right-10 bottom-10"
          />
        </Product>

        <Product
          href={`/product/moletom-never-stop-learning`}
          src={"/moletom-never-stop-learning.png"}
        >
          <ProductBadge
            title="Moletom Never Stop Learning"
            price={formatPrice(129)}
            className="right-10 bottom-10"
          />
        </Product>

        <Product
          href={`/product/moletom-never-stop-learning`}
          src={"/moletom-never-stop-learning.png"}
        >
          <ProductBadge
            title="Moletom Never Stop Learning"
            price={formatPrice(129)}
            className="right-10 bottom-10"
          />
        </Product>
      </div>
    </div>
  );
}
