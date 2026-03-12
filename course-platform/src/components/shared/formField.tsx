import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useFormContext } from "./formContext";
import { useMask } from "@react-input/mask";

type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  inputId?: string;
  className?: string;
  mask?: {
    format: string;
    replacement?: Record<string, RegExp>;
  };
  placeholder: string;
  children?: (params: {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
  }) => React.ReactElement;
};

export function FormField<T extends FieldValues>({
  name,
  label,
  inputId,
  className,
  mask,
  placeholder,
  children,
}: FormFieldProps<T>) {
  const form = useFormContext<T>();
  let maskRef = undefined;

  if (mask) {
    maskRef = useMask({
      mask: mask.format,
      replacement: mask.replacement || {
        _: /\d/,
      },
    });
  }

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
          {children ? (
            children({ field, fieldState })
          ) : (
            <Input
              {...field}
              id={inputId}
              ref={maskRef}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete="off"
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
