import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1).max(120),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Use HH:MM"),
  location: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).optional(),
  capacity: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() ? Number(v) : null))
    .refine((v) => v === null || (Number.isInteger(v) && v > 0), {
      message: "Capacity must be a positive integer",
    }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

