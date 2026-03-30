import { z } from "zod";

const hasOnlySafeTextChars = (value: string) =>
  /^[^\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]*$/.test(value);

const optionalLocationSchema = z
  .string()
  .trim()
  .max(120)
  .refine(hasOnlySafeTextChars, "Contains invalid characters")
  .or(z.literal(""))
  .transform((value) => (value === "" ? undefined : value));

const optionalDescriptionSchema = z
  .string()
  .trim()
  .max(2000)
  .refine(hasOnlySafeTextChars, "Contains invalid characters")
  .or(z.literal(""))
  .transform((value) => (value === "" ? undefined : value));

export const createEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .refine(hasOnlySafeTextChars, "Contains invalid characters"),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  time: z
    .string()
    .trim()
    .regex(/^\d{2}:\d{2}$/, "Use HH:MM"),
  location: optionalLocationSchema,
  description: optionalDescriptionSchema,
  capacity: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.trim() ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v > 0), {
      message: "Capacity must be a positive integer",
    }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

