import { PixIcon } from "@/components/icons/Pix";
import { CreditCard, LucideIcon } from "lucide-react";

type Method = "PIX" | "CREDIT_CARD";

type PaymentMethod = {
  label: string;
  value: Method;
  icon: LucideIcon;
};

const paymentMethods: PaymentMethod[] = [
  {
    label: "Pix",
    value: "PIX" as const,
    icon: PixIcon,
  },
  {
    label: "Credit card",
    value: "CREDIT_CARD" as const,
    icon: CreditCard,
  },
];

export { paymentMethods, type Method };
