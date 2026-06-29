import type { QuotePayload } from "~/utils/submitQuote";

type Status = "idle" | "submitting" | "success" | "error";
type FieldKey = "eventDate" | "guests" | "items" | "address" | "name" | "email" | "phone";

/** Required fields in visual order — drives rendering, validation, and the error summary. */
const FIELDS: { key: FieldKey; id: string; label: string }[] = [
  { key: "eventDate", id: "qf-date", label: "Event date" },
  { key: "guests", id: "qf-guests", label: "Guest count" },
  { key: "items", id: "qf-item-0", label: "Items needed" },
  { key: "address", id: "qf-address", label: "Delivery address" },
  { key: "name", id: "qf-name", label: "Full name" },
  { key: "email", id: "qf-email", label: "Email" },
  { key: "phone", id: "qf-phone", label: "Phone" },
];

function localTodayStr(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function useQuoteForm() {
  const form = reactive({
    eventDate: "",
    guests: "",
    items: [] as string[],
    address: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
    company_url: "", // honeypot — must stay empty
    form_ts: "", // stamped on mount (client) for the time-trap
  });

  const errors = reactive<Record<FieldKey, string>>({
    eventDate: "",
    guests: "",
    items: "",
    address: "",
    name: "",
    email: "",
    phone: "",
  });
  const touched = reactive<Record<FieldKey, boolean>>({
    eventDate: false,
    guests: false,
    items: false,
    address: false,
    name: false,
    email: false,
    phone: false,
  });

  const status = ref<Status>("idle");
  const submitError = ref("");
  const submitAttempted = ref(false);
  const shake = ref(false);

  // Progressive enhancement: native constraint validation is the baseline; we
  // only switch the form to novalidate once JS has mounted and taken over.
  const enhanced = ref(false);
  const minDate = ref<string | undefined>(undefined);

  const summaryRef = ref<HTMLElement | null>(null);
  const confirmationRef = ref<HTMLElement | null>(null);
  const submitErrorRef = ref<HTMLElement | null>(null);

  onMounted(() => {
    enhanced.value = true;
    minDate.value = localTodayStr();
    form.form_ts = String(Date.now()); // start the time-trap clock at page load
  });

  function validateField(key: FieldKey): boolean {
    let msg = "";
    switch (key) {
      case "eventDate":
        if (!form.eventDate) msg = "Please choose your event date.";
        else if (form.eventDate < localTodayStr()) msg = "The event date can’t be in the past.";
        break;
      case "guests": {
        const s = form.guests.trim();
        if (!s) msg = "Enter the number of guests.";
        else if (!/^\d+$/.test(s) || parseInt(s, 10) < 1)
          msg = "Guest count must be a whole number of 1 or more.";
        break;
      }
      case "items":
        if (form.items.length === 0) msg = "Select at least one item.";
        break;
      case "address":
        if (!form.address.trim()) msg = "Add a delivery address.";
        break;
      case "name":
        if (!form.name.trim()) msg = "Tell us your name.";
        break;
      case "email": {
        const s = form.email.trim();
        if (!s) msg = "Enter your email address.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) msg = "Enter a valid email address.";
        break;
      }
      case "phone": {
        const s = form.phone.trim();
        const digits = (s.match(/\d/g) || []).length;
        if (!s) msg = "Enter a phone number.";
        else if (!/^[\d+()\-\s]+$/.test(s) || digits < 7) msg = "Enter a valid phone number.";
        break;
      }
    }
    errors[key] = msg;
    return !msg;
  }

  function validateAll(): boolean {
    let ok = true;
    for (const f of FIELDS) {
      touched[f.key] = true;
      if (!validateField(f.key)) ok = false;
    }
    return ok;
  }

  /** Blur: mark touched and validate this field. */
  function handleBlur(key: FieldKey) {
    touched[key] = true;
    validateField(key);
  }

  /** Input: only re-validate a field that is already showing an error (live clear). */
  function handleInput(key: FieldKey) {
    if (errors[key]) validateField(key);
  }

  /** Checkbox change: re-validate items once they've been interacted with or after a submit attempt. */
  function handleItemsChange() {
    touched.items = true;
    if (errors.items || submitAttempted.value) validateField("items");
  }

  const summaryErrors = computed(() =>
    FIELDS.filter((f) => errors[f.key]).map((f) => ({ ...f, message: errors[f.key] })),
  );
  const hasErrors = computed(() => summaryErrors.value.length > 0);
  const isSubmitting = computed(() => status.value === "submitting");

  function focusField(id: string) {
    if (import.meta.client) document.getElementById(id)?.focus();
  }

  function buildPayload(): QuotePayload {
    return {
      eventDate: form.eventDate,
      guests: parseInt(form.guests, 10),
      items: [...form.items],
      address: form.address.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      notes: form.notes.trim(),
      company_url: form.company_url,
      form_ts: form.form_ts,
      submittedAt: new Date().toISOString(),
    };
  }

  async function handleSubmit() {
    submitAttempted.value = true;

    if (!validateAll()) {
      status.value = "idle";
      await nextTick();
      // re-trigger the (reduced-motion-gated) shake each failed attempt
      shake.value = false;
      await nextTick();
      shake.value = true;
      summaryRef.value?.focus();
      return;
    }

    status.value = "submitting";
    submitError.value = "";
    try {
      await submitQuote(buildPayload());
      status.value = "success";
      await nextTick();
      confirmationRef.value?.focus();
    } catch (e) {
      const fieldErrors = (e as { fieldErrors?: Record<string, string> })?.fieldErrors;
      if (fieldErrors) {
        // Server rejected (422) — surface its field errors in the existing summary.
        for (const f of FIELDS) {
          if (fieldErrors[f.key]) {
            errors[f.key] = fieldErrors[f.key];
            touched[f.key] = true;
          }
        }
        status.value = "idle";
        await nextTick();
        shake.value = false;
        await nextTick();
        shake.value = true;
        summaryRef.value?.focus();
      } else {
        status.value = "error";
        submitError.value =
          e instanceof Error
            ? e.message
            : "Something went wrong. Please try again, or call (240) 555-0142.";
        await nextTick();
        submitErrorRef.value?.focus();
      }
    }
  }

  function resetForm() {
    Object.assign(form, {
      eventDate: "",
      guests: "",
      items: [],
      address: "",
      name: "",
      email: "",
      phone: "",
      notes: "",
      company_url: "",
      form_ts: String(Date.now()),
    });
    for (const f of FIELDS) {
      errors[f.key] = "";
      touched[f.key] = false;
    }
    submitAttempted.value = false;
    submitError.value = "";
    status.value = "idle";
  }

  return {
    FIELDS,
    form,
    errors,
    touched,
    status,
    submitError,
    submitAttempted,
    shake,
    enhanced,
    minDate,
    summaryRef,
    confirmationRef,
    submitErrorRef,
    summaryErrors,
    hasErrors,
    isSubmitting,
    handleBlur,
    handleInput,
    handleItemsChange,
    handleSubmit,
    focusField,
    resetForm,
  };
}
