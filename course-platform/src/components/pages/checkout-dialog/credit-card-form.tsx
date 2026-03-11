"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { creditCardCheckoutFormSchema } from "@/server/schemas/payment";

type FormData = z.infer<typeof creditCardCheckoutFormSchema>;

export function CreditCardForm() {
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

  return (
    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-4">
        <div>
          <p>PREVIEW OF CREDIT CARD</p>
        </div>
      </div>
      <FieldGroup>
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
                id="credit-card-form-card-number"
                aria-invalid={fieldState.invalid}
                placeholder="0000 0000 0000 0000"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        {/* <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-description">
                Description
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="form-rhf-demo-description"
                  placeholder="I'm having an issue with the login button on mobile."
                  rows={6}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value.length}/100 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>
                Include steps to reproduce, expected behavior, and what actually
                happened.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        /> */}
      </FieldGroup>
      <div className="mt-6 flex items-center justify-between">
        <Button variant={"outline"}>
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
