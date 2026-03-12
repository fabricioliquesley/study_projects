"use client";

import { FormProvider } from "@/components/shared/formContext";
import { FormField } from "@/components/shared/formField";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { cepMask, cpfMask } from "@/constants/input-masks";
import { pixCheckoutFormSchema } from "@/server/schemas/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type FormData = z.infer<typeof pixCheckoutFormSchema>;

type PixFormProps = {
  onBack: () => void;
};

export function PixForm({ onBack }: PixFormProps) {
  const [step, setStep] = useState(1);

  const form = useForm<FormData>({
    resolver: zodResolver(pixCheckoutFormSchema),
    defaultValues: {
      addressNumber: "",
      cpf: "",
      name: "",
      postalCode: "",
    },
  });

  const steps = {
    step1: <Step1Component />,
    step2: <div className="w-full">step 2</div>,
  };

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
    <FormProvider form={form}>
      <form
        id="pix-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        {steps[`step${step}` as keyof typeof steps]}

        <div className="mt-6 flex w-full flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
          <Button variant={"outline"} type="button" onClick={onBack}>
            <ArrowLeft />
            Back
          </Button>

          {step == 1 ? (
            <Button type="submit">
              Continue
              <ArrowRight />
            </Button>
          ) : (
            <Button type="button">
              Confirm payment
              <Check />
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

function Step1Component() {
  return (
    <div className="w-full">
      <h2 className="mt-2 mb-3 text-center">
        To generate the QR Code, please enter the information below
        <span className="block text-sm opacity-50">
          (will only be used for issuing invoices)
        </span>
      </h2>

      <FieldGroup className="grid w-full gap-2 sm:grid-cols-2">
        <FormField<FormData>
          name="name"
          inputId="pix-form-name"
          placeholder="John Doe"
          label="Name"
        />
        <FormField<FormData>
          name="cpf"
          inputId="pix-form-cpf"
          mask={{ format: cpfMask }}
          placeholder="xxx.xxx.xxx-xx"
          label="CPF"
        />
        <FormField<FormData>
          name="postalCode"
          inputId="pix-form-cep"
          mask={{ format: cepMask }}
          placeholder="xxxxx-xxx"
          label="CEP"
        />
        <FormField<FormData>
          name="addressNumber"
          inputId="pix-form-address-number"
          placeholder="xx"
          label="Address number"
        />
      </FieldGroup>
    </div>
  );
}
