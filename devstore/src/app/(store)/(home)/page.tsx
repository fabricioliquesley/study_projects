import { Product } from "@/components/product";
import { ProductBadge } from "@/components/product/badge";

export default function Home() {
  return (
    <div className="grid max-h-[860px] grid-cols-9 grid-rows-6 gap-6">
      <Product
        href="/"
        src="/moletom-never-stop-learning.png"
        alt="Moletom Never Stop Learning"
      >
        <ProductBadge
          title="Moletom Never Stop Learning"
          price="R$129"
          className="right-28 bottom-28"
        />
      </Product>
      <Product
        href="/"
        src="/moletom-java.png"
        alt="Moletom Java"
        className="col-span-3 row-span-3"
      >
        <ProductBadge
          title="Moletom Java"
          price="R$129"
          className="bottom-10 mx-auto"
        />
      </Product>
      <Product
        href="/"
        src="/camiseta-dowhile-2022.png"
        alt="Camiseta Dowhile 2022"
        className="col-span-3 row-span-3"
      >
        <ProductBadge
          title="Camiseta Dowhile 2022"
          price="R$129"
          className="bottom-10 mx-auto"
        />
      </Product>
    </div>
  );
}
