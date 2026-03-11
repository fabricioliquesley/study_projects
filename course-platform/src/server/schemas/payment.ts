import * as z from "zod";

export const cpfSchema = z.string().refine((cpf: string) => {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const cpfDigits = cpf.split("").map((el) => +el);
  const rest = (count: number): number => {
    return (
      ((cpfDigits
        .slice(0, count - 12)
        .reduce((acc, el, index) => acc + el * (count - index), 0) *
        10) %
        11) %
      10
    );
  };
  return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
}, "Enter a valid CPF number.");

export const pixCheckoutFormSchema = z.object({
  name: z.string().nonempty({ message: "The name is required." }),
  postalCode: z.string().nonempty({ message: "The zip code is required." }),
  addressNumber: z
    .string()
    .nonempty({ message: "The address number is required." }),
  cpf: cpfSchema,
});

export const pixCheckoutSchema = pixCheckoutFormSchema.extend({
  courseId: z.string().nonempty(),
});

export type PixCheckoutSchema = z.infer<typeof pixCheckoutSchema>;

export const creditCardCheckoutFormSchema = z.object({
  name: z.string().nonempty({
    message: "Enter your name.",
  }),
  cardNumber: z
    .string()
    .nonempty({
      message: "Enter your card number.",
    })
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, {
      message: "Invalid card number.",
    }),
  cardValidThru: z
    .string()
    .nonempty({
      message: "Enter the card's expiration date.",
    })
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, {
      message: "Enter a valid expiration date (MM/AA).",
    })
    .refine(
      (value) => {
        const [month, year] = value.split("/").map(Number);
        const currentDate = new Date();
        // @ts-expect-error - This is a valid date
        const inputDate = new Date(`20${year}`, month - 1);
        return (
          inputDate >=
          new Date(currentDate.getFullYear(), currentDate.getMonth())
        );
      },
      {
        message: "Invalid expiration date.",
      },
    ),
  cardCvv: z
    .string()
    .nonempty({
      message: "Enter the card's CVV.",
    })
    .regex(/^\d{3,4}$/, {
      message: "The CVV must have 3 or 4 digits.",
    }),
  installments: z
    .number()
    .int()
    .min(1, {
      message: "Select the number of installments.",
    })
    .max(6, {
      message: "The maximum number of installments is 6.",
    }),

  cpf: cpfSchema,
  address: z.string().optional(),
  postalCode: z.string().nonempty({
    message: "Enter your zip code.",
  }),
  addressNumber: z.string().nonempty({
    message: "Enter the address number.",
  }),
  phone: z
    .string()
    .min(10, {
      message: "Invalid phone number.",
    })
    .nonempty({
      message: "Enter the phone number.",
    }),
});

export const creditCardCheckoutSchema = creditCardCheckoutFormSchema.extend({
  courseId: z.string().nonempty(),
});

export type CreditCardCheckoutSchema = z.infer<typeof creditCardCheckoutSchema>;
