import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type FormFieldProps<T extends FieldValues> = {
  name: Path<T>;
  form: UseFormReturn<T>;
  label?: string;
  inputId?: string;
  className?: string;
  maskRef?: React.Ref<HTMLInputElement>;
  placeholder: string;
  children?: (params: {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
  }) => React.ReactElement;
};

export function FormField<T extends FieldValues>({
  name,
  form,
  label,
  inputId,
  className,
  maskRef,
  placeholder,
  children,
}: FormFieldProps<T>) {
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
