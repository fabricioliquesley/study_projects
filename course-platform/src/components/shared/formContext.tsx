"use client";

import { createContext, useContext } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

const FormContext = createContext<UseFormReturn<any> | null>(null);

type FormProviderProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  children: React.ReactNode;
};

export function FormProvider<T extends FieldValues>({
  form,
  children,
}: FormProviderProps<T>) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

export function useFormContext<T extends FieldValues>() {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context as UseFormReturn<T>;
}
