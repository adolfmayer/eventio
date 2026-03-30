"use client";

import * as React from "react";

import { createEventAction } from "@/features/events/actions";

type CreateEventErrors = {
  title: string | null;
  description: string | null;
  date: string | null;
  time: string | null;
  location: string | null;
  capacity: string | null;
  form: string | null;
};

type CreateEventFormProps = {
  from: string;
  serverError?: string;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export function CreateEventForm({ from, serverError }: CreateEventFormProps) {
  const [errors, setErrors] = React.useState<CreateEventErrors>({
    title: null,
    description: null,
    date: null,
    time: null,
    location: null,
    capacity: null,
    form: serverError ?? null,
  });

  const onSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "");
    const date = String(formData.get("date") ?? "").trim();
    const time = String(formData.get("time") ?? "").trim();
    const location = String(formData.get("location") ?? "");
    const capacity = String(formData.get("capacity") ?? "").trim();

    const next: CreateEventErrors = {
      title: null,
      description: null,
      date: null,
      time: null,
      location: null,
      capacity: null,
      form: null,
    };

    if (!title) next.title = "Title is required.";
    if (description.length > 2000) next.description = "Description must be at most 2000 characters.";
    if (!date) next.date = "Date is required.";
    else if (!DATE_RE.test(date)) next.date = "Use YYYY-MM-DD.";
    if (!time) next.time = "Time is required.";
    else if (!TIME_RE.test(time)) next.time = "Use HH:MM.";
    if (location.length > 120) next.location = "Location must be at most 120 characters.";
    if (capacity) {
      const n = Number(capacity);
      if (!Number.isInteger(n) || n <= 0) next.capacity = "Capacity must be a positive integer.";
    }

    const hasErrors = Object.values(next).some(Boolean);
    setErrors(next);
    if (hasErrors) event.preventDefault();
  }, []);

  const inputClass = (error: string | null) =>
    `mt-1 block h-8 w-full border-b bg-transparent text-[16px] leading-6 text-text outline-none ${
      error ? "border-danger" : "border-stroke"
    }`;

  return (
    <form action={createEventAction} onSubmit={onSubmit} className="mt-6" noValidate>
      <input type="hidden" name="from" value={from} />

      <label className="block">
        <span className="text-[16px] leading-6 text-muted sm:text-[18px]">Title</span>
        <input name="title" type="text" className={inputClass(errors.title)} required maxLength={120} />
        {errors.title ? <p className="mt-2 text-[14px] leading-6 text-danger">{errors.title}</p> : null}
      </label>

      <label className="mt-6 block">
        <span className="text-[16px] leading-6 text-muted sm:text-[18px]">Description</span>
        <input name="description" type="text" className={inputClass(errors.description)} maxLength={2000} />
        {errors.description ? (
          <p className="mt-2 text-[14px] leading-6 text-danger">{errors.description}</p>
        ) : null}
      </label>

      <label className="mt-6 block">
        <span className="text-[16px] leading-6 text-muted sm:text-[18px]">Date</span>
        <input name="date" type="date" className={inputClass(errors.date)} required />
        {errors.date ? <p className="mt-2 text-[14px] leading-6 text-danger">{errors.date}</p> : null}
      </label>

      <label className="mt-6 block">
        <span className="text-[16px] leading-6 text-muted sm:text-[18px]">Time</span>
        <input name="time" type="time" className={inputClass(errors.time)} required />
        {errors.time ? <p className="mt-2 text-[14px] leading-6 text-danger">{errors.time}</p> : null}
      </label>

      <label className="mt-6 block">
        <span className="text-[16px] leading-6 text-muted sm:text-[18px]">Location</span>
        <input name="location" type="text" className={inputClass(errors.location)} maxLength={120} />
        {errors.location ? (
          <p className="mt-2 text-[14px] leading-6 text-danger">{errors.location}</p>
        ) : null}
      </label>

      <label className="mt-6 block">
        <span className="text-[16px] leading-6 text-muted sm:text-[18px]">Capacity</span>
        <input name="capacity" type="number" min={1} className={inputClass(errors.capacity)} />
        {errors.capacity ? <p className="mt-2 text-[14px] leading-6 text-danger">{errors.capacity}</p> : null}
      </label>

      {errors.form ? <p className="mt-4 text-[14px] leading-6 text-danger">{errors.form}</p> : null}

      <button
        type="submit"
        className="mx-auto mt-8 block h-[57px] w-[240px] rounded-[4px] bg-[#22D486] text-[16px] leading-8 tracking-[1px] text-white uppercase hover:bg-[#1DBB76]"
      >
        CREATE NEW EVENT
      </button>
    </form>
  );
}

