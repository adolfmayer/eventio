"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { updateEventAction } from "@/features/events/actions";
import { createEventSchema } from "@/features/events/schemas";

type EditEventFormProps = {
  formId: string;
  eventId: string;
  initialValues: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    capacity: string;
  };
  serverError?: string;
};

type EditEventFormValues = z.input<typeof createEventSchema>;

export function EditEventForm({
  formId,
  eventId,
  initialValues,
  serverError,
}: EditEventFormProps) {
  const [formError, setFormError] = React.useState<string | null>(serverError ?? null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditEventFormValues, unknown, z.output<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    mode: "onChange",
    defaultValues: initialValues,
  });

  const onSubmit = React.useCallback(
    async (values: z.output<typeof createEventSchema>) => {
      setFormError(null);
      setIsSubmitting(true);

      const formData = new FormData();
      formData.set("eventId", eventId);
      formData.set("title", values.title);
      formData.set("description", values.description ?? "");
      formData.set("date", values.date);
      formData.set("time", values.time);
      formData.set("location", values.location ?? "");
      formData.set("capacity", values.capacity === null ? "" : String(values.capacity));

      try {
        const result = await updateEventAction(formData);
        if (!result.ok) {
          setFormError(result.error);
        }
      } catch {
        setFormError("Unexpected server error. Try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [eventId],
  );

  const inputClass = (error?: string) =>
    `mt-1 block h-8 w-full border-b bg-transparent pb-2 text-[16px] leading-6 text-text outline-none ${
      error ? "border-danger" : "border-stroke"
    }`;

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} className="p-6 lg:p-8" noValidate>
      <input type="hidden" name="eventId" value={eventId} />
      {formError ? <p className="mb-4 text-[14px] leading-6 text-danger">{formError}</p> : null}

      <label className="block">
        <span className="text-[14px] leading-6 text-muted">Date</span>
        <input
          type="date"
          className={inputClass(errors.date?.message)}
          aria-invalid={Boolean(errors.date)}
          {...register("date")}
        />
        {errors.date ? <p className="mt-2 text-[14px] leading-6 text-danger">{errors.date.message}</p> : null}
      </label>

      <label className="mt-6 block">
        <span className="text-[14px] leading-6 text-muted">Time</span>
        <input
          type="time"
          className={inputClass(errors.time?.message)}
          aria-invalid={Boolean(errors.time)}
          {...register("time")}
        />
        {errors.time ? <p className="mt-2 text-[14px] leading-6 text-danger">{errors.time.message}</p> : null}
      </label>

      <label className="mt-6 block">
        <span className="text-[14px] leading-6 text-muted">Title</span>
        <input
          type="text"
          className={inputClass(errors.title?.message)}
          maxLength={120}
          aria-invalid={Boolean(errors.title)}
          {...register("title")}
        />
        {errors.title ? <p className="mt-2 text-[14px] leading-6 text-danger">{errors.title.message}</p> : null}
      </label>

      <label className="mt-6 block">
        <span className="text-[14px] leading-6 text-muted">Description</span>
        <textarea
          className={`mt-1 block min-h-24 w-full resize-y border-b bg-transparent py-2 text-[16px] leading-6 text-text outline-none ${
            errors.description ? "border-danger" : "border-stroke"
          }`}
          maxLength={2000}
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
        {errors.description ? (
          <p className="mt-2 text-[14px] leading-6 text-danger">{errors.description.message}</p>
        ) : null}
      </label>

      <label className="mt-6 block">
        <span className="text-[14px] leading-6 text-muted">Location</span>
        <input
          type="text"
          className={inputClass(errors.location?.message)}
          maxLength={120}
          aria-invalid={Boolean(errors.location)}
          {...register("location")}
        />
        {errors.location ? (
          <p className="mt-2 text-[14px] leading-6 text-danger">{errors.location.message}</p>
        ) : null}
      </label>

      <label className="mt-6 block">
        <span className="text-[14px] leading-6 text-muted">Capacity</span>
        <input
          type="number"
          min={1}
          className={inputClass(errors.capacity?.message)}
          aria-invalid={Boolean(errors.capacity)}
          {...register("capacity")}
        />
        {errors.capacity ? (
          <p className="mt-2 text-[14px] leading-6 text-danger">{errors.capacity.message}</p>
        ) : null}
      </label>

      <button type="submit" className="sr-only" disabled={isSubmitting}>
        Save event
      </button>
    </form>
  );
}
