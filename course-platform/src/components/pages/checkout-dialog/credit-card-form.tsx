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

  const cepMaskRef = useMask({
    mask: "_____-___",
    replacement: {
      _: /\d/,
    },
  });

  return (
    <form id="form-rhf-demo" onSubmit={handleSubmit(onSubmit)}>
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
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-full">
              <FieldLabel htmlFor="credit-card-form-card-name">
                Name on the card
              </FieldLabel>
              <Input
                {...field}
                id="credit-card-form-card-name"
                aria-invalid={fieldState.invalid}
                placeholder="John W Doe"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="cpf"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="credit-card-form-cpf">
                CPF of the holder
              </FieldLabel>
              <Input
                {...field}
                ref={cpfMaskRef}
                id="credit-card-form-cpf"
                aria-invalid={fieldState.invalid}
                placeholder="xxx.xxx.xxx-xx"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="credit-card-form-phone">Phone</FieldLabel>
              <Input
                {...field}
                ref={phoneMaskRef}
                id="credit-card-form-phone"
                aria-invalid={fieldState.invalid}
                placeholder="(xx) xxxxx-xxxx"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Separator className="col-span-full my-1 sm:my-2" />

        <Controller
          name="cardNumber"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="credit-card-form-card-number">
                Card number
              </FieldLabel>
              <Input
                {...field}
                ref={cardNumberMaskRef}
                id="credit-card-form-card-number"
                aria-invalid={fieldState.invalid}
                placeholder="xxxx xxxx xxxx xxxx"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="cardValidThru"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="credit-card-form-expiration-date">
                Card expiration date
              </FieldLabel>
              <Input
                {...field}
                ref={cardValidThruMaskRef}
                id="credit-card-form-expiration-date"
                aria-invalid={fieldState.invalid}
                placeholder="xx/xx"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="cardCvv"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="credit-card-form-card-cvv">
                Card CVV
              </FieldLabel>
              <Input
                {...field}
                id="credit-card-form-card-cvv"
                aria-invalid={fieldState.invalid}
                placeholder="xxx"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="installments"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Number of installments</FieldLabel>
              <Select
                value={String(field.value)}
                onChange={(value) => field.onChange(+value)}
                options={installmentsOptions}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Separator className="col-span-full my-1 sm:my-2" />

        <div className="col-span-full grid gap-2 sm:grid-cols-[1.4fr_1fr_1fr]">
          <Controller
            name="address"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="credit-card-form-address">
                  Address
                </FieldLabel>
                <Input
                  {...field}
                  id="credit-card-form-address"
                  aria-invalid={fieldState.invalid}
                  placeholder="(optional)"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="addressNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="credit-card-form-address-number">
                  Address number
                </FieldLabel>
                <Input
                  {...field}
                  id="credit-card-form-address-number"
                  aria-invalid={fieldState.invalid}
                  placeholder="xx"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="postalCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="credit-card-form-cep">CEP</FieldLabel>
                <Input
                  {...field}
                  ref={cepMaskRef}
                  id="credit-card-form-cep"
                  aria-invalid={fieldState.invalid}
                  placeholder="xxxxx-xxx"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
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
