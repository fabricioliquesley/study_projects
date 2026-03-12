"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMask } from "@react-input/mask";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { creditCardCheckoutFormSchema } from "@/server/schemas/payment";
import { Separator } from "@/components/ui/separator";
import { Select } from "@/components/ui/select";
import Cards from "react-credit-cards-2";
import { FormField } from "@/components/shared/formField";

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

  const cpfMaskRef = useMask({
    mask: "___.___.___-__",
    replacement: {
      _: /\d/,
    },
  });

  const phoneMaskRef = useMask({
    mask: "+55 (__) _____-____",
    replacement: {
      _: /\d/,
    },
  });

  const cardNumberMaskRef = useMask({
    mask: "____ ____ ____ ____",
    replacement: {
      _: /\d/,
    },
  });

  const cardValidThruMaskRef = useMask({
    mask: "__/__",
    replacement: {
      _: /\d/,
    },
  });

  const cvvMaskRef = useMask({
    mask: "___",
    replacement: {
      _: /\d/,
    },
  });

  const cepMaskRef = useMask({
    mask: "_____-___",
    replacement: {
      _: /\d/,
    },
  });

  return (
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
        <FormField
          form={form}
          name="name"
          inputId="credit-card-form-card-name"
          label="Name on the card"
          placeholder="John W Doe"
          className="col-span-full"
        />
        <FormField
          form={form}
          name="cpf"
          inputId="credit-card-form-cpf"
          maskRef={cpfMaskRef}
          label="CPF of the holder"
          placeholder="xxx.xxx.xxx-xx"
        />
        <FormField
          form={form}
          name="phone"
          inputId="credit-card-form-phone"
          maskRef={phoneMaskRef}
          label="Phone"
          placeholder="(xx) xxxxx-xxxx"
        />

        <Separator className="col-span-full my-1 sm:my-2" />

        <FormField
          form={form}
          name="cardNumber"
          inputId="credit-card-form-card-number"
          maskRef={cardNumberMaskRef}
          label="Card number"
          placeholder="xxxx xxxx xxxx xxxx"
        />
        <FormField
          form={form}
          name="cardValidThru"
          inputId="credit-card-form-expiration-date"
          maskRef={cardValidThruMaskRef}
          label="Card expiration date"
          placeholder="xx/xx"
        />
        <FormField
          form={form}
          name="cardCvv"
          inputId="credit-card-form-card-cvv"
          maskRef={cvvMaskRef}
          label="Card CVV"
          placeholder="xxx"
        />
        <FormField
          form={form}
          name="installments"
          maskRef={phoneMaskRef}
          label="Number of installments"
          placeholder=""
        >
          {({ field, fieldState }) => (
            <Select
              value={String(field.value)}
              onChange={(value) => field.onChange(+value)}
              options={installmentsOptions}
            />
          )}
        </FormField>

        <Separator className="col-span-full my-1 sm:my-2" />

        <div className="col-span-full grid gap-2 sm:grid-cols-[1.4fr_1fr_1fr]">
          <FormField
            form={form}
            name="address"
            inputId="credit-card-form-address"
            label="Address"
            placeholder="(optional)"
          />
          <FormField
            form={form}
            name="addressNumber"
            inputId="credit-card-form-address-number"
            label="Address number"
            placeholder="xx"
          />
          <FormField
            form={form}
            name="postalCode"
            inputId="credit-card-form-cep"
            maskRef={cepMaskRef}
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
  );
}
