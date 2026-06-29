/**
 * Quote payload posted to the backend.
 */
export interface QuotePayload {
  eventDate: string;
  guests: number;
  items: string[];
  address: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  company_url: string; // honeypot (must stay empty)
  form_ts: string; // client render timestamp (ms)
  submittedAt: string;
}

/** Thrown when the server returns 422 with field-level validation errors. */
export class QuoteValidationError extends Error {
  fieldErrors: Record<string, string>;
  constructor(fieldErrors: Record<string, string>) {
    super('Quote validation failed');
    this.name = 'QuoteValidationError';
    this.fieldErrors = fieldErrors;
  }
}

/**
 * ============================================================================
 *  submitQuote() — THE SINGLE CLIENT INTEGRATION POINT FOR THE QUOTE FORM
 * ============================================================================
 *  POSTs to the Nuxt server route (server/api/quote.post.ts), which re-validates
 *  and emails the business via Resend. The `X-Requested-With` header tells the
 *  endpoint to return JSON (rather than the no-JS 303 → /thank-you redirect).
 *
 *  Resolves { ok: true } on success. Throws QuoteValidationError (422, with
 *  per-field messages) or a generic Error on any other failure.
 *
 *  To change provider/destination, edit server/api/quote.post.ts — not here.
 */
export const submitQuote = async (payload: QuotePayload): Promise<{ ok: true }> => {
  try {
    return await $fetch<{ ok: true }>('/api/quote', {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json'
      },
      body: payload
    });
  } catch (e: unknown) {
    const err = e as {
      statusCode?: number;
      response?: { status?: number };
      data?: { errors?: Record<string, string> };
    };
    const status = err?.statusCode ?? err?.response?.status;
    if (status === 422 && err?.data?.errors) throw new QuoteValidationError(err.data.errors);
    throw new Error(
      'We couldn\'t send your request just now. Please try again, or call (240) 555-0142.'
    );
  }
};
