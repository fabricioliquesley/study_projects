"use client";

import { Course } from "@/@types/types";
import { Dialog } from "../../ui/dialog";
import { useState } from "react";
import { Method, paymentMethods } from "@/constants/payment-methods";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { CreditCardForm } from "./credit-card-form";

type CheckoutDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  course: Course;
};

export function CheckoutDialog({ open, setOpen, course }: CheckoutDialogProps) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<Method>("PIX");

  const handleContinue = () => {
    setStep((prevStep: number) => prevStep + 1);
  };

  const steps = {
    step1: (
      <ChosePaymentMethod
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        handleContinue={handleContinue}
      />
    ),
    step2: renderPaymentForm({ paymentMethod }),
  };

  return (
    <Dialog
      open={open}
      setOpen={setOpen}
      height="95vh"
      title="Complete purchase"
      preventOutsideClick
      content={
        <div className="pt-4">{steps[`step${step}` as keyof typeof steps]}</div>
      }
    />
  );
}

type ChosePaymentMethodProps = {
  paymentMethod: Method;
  setPaymentMethod: (method: Method) => void;
  handleContinue: () => void;
};

function ChosePaymentMethod({
  paymentMethod,
  setPaymentMethod,
  handleContinue,
}: ChosePaymentMethodProps) {
  return (
    <div className="flex flex-col">
      <h2 className="mb-3">Payment methods</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {paymentMethods.map((method) => (
          <Button
            key={method.value}
            variant={"outline"}
            onClick={() => setPaymentMethod(method.value)}
            className={cn(
              "flex h-auto w-full items-center justify-center gap-3 rounded-xl p-4 text-lg font-semibold transition-colors duration-300 disabled:opacity-50",
              paymentMethod === method.value &&
                "bg-primary/10! text-primary border-primary! hover:text-primary",
            )}
          >
            <method.icon className="h-6 min-h-6 w-6 min-w-6" />
            {method.label}
          </Button>
        ))}
      </div>

      <Button onClick={handleContinue} className="mt-6 ml-auto">
        Continue
      </Button>
    </div>
  );
}

type RenderPaymentForm = {
  paymentMethod: Method;
};

function renderPaymentForm({ paymentMethod }: RenderPaymentForm) {
  switch (paymentMethod) {
    case "PIX":
      return <div>PIX</div>;
    case "CREDIT_CARD":
      return <CreditCardForm />;
    default:
      return <div>Unknown payment method</div>;
  }
}
