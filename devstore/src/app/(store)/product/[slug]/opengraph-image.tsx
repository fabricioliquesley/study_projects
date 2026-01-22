import { getProductBySlug } from "@/app/actions/getProductBySlug";
import { env } from "@/env";
import { ImageResponse } from "next/og";

export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

interface ImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: ImageProps) {
  const product = await getProductBySlug((await params).slug);

  const productImageURL = new URL(product.image, env.APP_URL).toString();

  return new ImageResponse(
    <div
      style={{
        background: "rgb(9, 9, 11)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <img src={productImageURL} alt="" style={{ width: "100%" }} />
    </div>,
    {
      ...size,
    },
  );
}
