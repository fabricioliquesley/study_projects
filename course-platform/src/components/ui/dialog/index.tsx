import type { ComponentPropsWithoutRef } from "react";
import type * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog as DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./primitives";

type DialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  children?: React.ReactNode;
  content: React.ReactNode;
  width?: string;
  height?: string;
  preventOutsideClick?: boolean;
};

type InteractOutsideEvent =
  NonNullable<
    ComponentPropsWithoutRef<
      typeof DialogPrimitive.Content
    >["onInteractOutside"]
  > extends (event: infer E) => void
    ? E
    : never;

export function Dialog({
  open,
  setOpen,
  title,
  children,
  content,
  width = "600px",
  height = "90vh",
  preventOutsideClick,
}: DialogProps) {
  const handleInteractOutside = (event: InteractOutsideEvent) => {
    if (preventOutsideClick) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent
        style={{ maxWidth: width, maxHeight: height }}
        className="overflow-y-auto"
        onInteractOutside={handleInteractOutside}
      >
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}

        {content}
      </DialogContent>
    </DialogRoot>
  );
}
