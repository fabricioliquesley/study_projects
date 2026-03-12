"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { creditCardCheckoutFormSchema } from "@/server/schemas/payment";
import { Separator } from "@/components/ui/separator";
import { Select } from "@/components/ui/select";
import Cards from "react-credit-cards-2";
import { FormField } from "@/components/shared/formField";
import { FormProvider } from "@/components/shared/formContext";
import {
  cardNumberMask,
  cardValidThruMask,
  cepMask,
  cpfMask,
  cvvMask,
  phoneMask,
} from "@/constants/input-masks";

type FormData = z.infer<typeof creditCardCheckoutFormSchema>;

type CreditCardFormProps = {
  onBack: () => void;
};

export function CreditCardForm({ onBack }: CreditCardFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(creditCardCheckoutFormSchema),
    defaultValues: {
      installments: 1,
      cardNumber: "",
      cardCvv: "",
      cardValidThru: "",
      name: "",
      address: "",
      addressNumber: "",
      cpf: "",
      phone: "",
      postalCode: "",
    },
  });

  const { handleSubmit, watch } = form;

  const formValues = watch();

  function onSubmit(data: FormData) {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
  }

  const installmentsOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}x`,
    value: `${i + 1}`,
  }));

  return (
    <FormProvider form={form}>
      <form id="credit-card-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-4">
          <div>
            <Cards
              number={formValues.cardNumber}
              cvc={formValues.cardCvv}
              expiry={formValues.cardValidThru}
              name={formValues.name}
            />
          </div>
        </div>
        <FieldGroup className="grid w-full flex-1 gap-2 sm:grid-cols-2">
          <FormField<FormData>
            name="name"
            inputId="credit-card-form-card-name"
            label="Name on the card"
            placeholder="John W Doe"
            className="col-span-full"
          />
          <FormField<FormData>
            name="cpf"
            inputId="credit-card-form-cpf"
            mask={{ format: cpfMask }}
            label="CPF of the holder"
            placeholder="xxx.xxx.xxx-xx"
          />
          <FormField<FormData>
            name="phone"
            inputId="credit-card-form-phone"
            mask={{ format: phoneMask }}
            label="Phone"
            placeholder="(xx) xxxxx-xxxx"
          />

          <Separator className="col-span-full my-1 sm:my-2" />

          <FormField<FormData>
            name="cardNumber"
            inputId="credit-card-form-card-number"
            mask={{ format: cardNumberMask }}
            label="Card number"
            placeholder="xxxx xxxx xxxx xxxx"
          />
          <FormField<FormData>
            name="cardValidThru"
            inputId="credit-card-form-expiration-date"
            mask={{ format: cardValidThruMask }}
            label="Card expiration date"
            placeholder="xx/xx"
          />
          <FormField<FormData>
            name="cardCvv"
            inputId="credit-card-form-card-cvv"
            mask={{ format: cvvMask }}
            label="Card CVV"
            placeholder="xxx"
          />
          <FormField<FormData>
            name="installments"
            label="Number of installments"
            placeholder=""
          >
            {({ field }) => (
              <Select
                value={String(field.value)}
                onChange={(value) => field.onChange(+value)}
                options={installmentsOptions}
              />
            )}
          </FormField>

          <Separator className="col-span-full my-1 sm:my-2" />

          <div className="col-span-full grid gap-2 sm:grid-cols-[1.4fr_1fr_1fr]">
            <FormField<FormData>
              name="address"
              inputId="credit-card-form-address"
              label="Address"
              placeholder="(optional)"
            />
            <FormField<FormData>
              name="addressNumber"
              inputId="credit-card-form-address-number"
              label="Address number"
              placeholder="xx"
            />
            <FormField<FormData>
              name="postalCode"
              inputId="credit-card-form-cep"
              mask={{ format: cepMask }}
              label="CEP"
              placeholder="xxxxx-xxx"
            />
          </div>
        </FieldGroup>

        <div className="mt-6 flex items-center justify-between">
          <Button variant={"outline"} type="button" onClick={onBack}>
            <ArrowLeft />
            Back
          </Button>
          <Button type="submit">
            Confirm
            <ArrowRight />
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
