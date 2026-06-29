<template>
  <section
    id="quote"
    class="scroll-anchor bg-sand py-20 lg:py-28"
    aria-labelledby="quote-heading"
  >
    <div class="shell grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
      <!-- Left: pricing / process (unchanged from step 2) -->
      <div
        v-reveal
        class="reveal"
      >
        <FoldEyebrow
          number="02"
          label="Pricing & Quote"
          class="mb-7"
        />
        <h2
          id="quote-heading"
          class="max-w-md font-display text-4xl leading-[1.04] lg:text-[46px]"
        >
          Transparent pricing, tailored to your day.
        </h2>
        <p class="mt-5 max-w-md text-base leading-relaxed text-muted">
          No surprises. Tell us the shape of your event and we'll build a clear,
          line-item quote — rentals, delivery, setup &amp; pickup, all itemized.
        </p>

        <ol class="mt-7">
          <li
            v-for="(s, i) in steps"
            :key="s.n"
            class="flex gap-5 border-t border-[#d9d1c1] py-5"
            :class="{ 'border-b': i === steps.length - 1 }"
          >
            <span
              class="font-display text-[22px] leading-none text-gold"
              aria-hidden="true"
            >
              {{ s.n }}
            </span>
            <div>
              <p class="text-[15px] font-semibold text-ink">
                {{ s.title }}
              </p>
              <p class="mt-1.5 text-[13px] leading-relaxed text-muted">
                {{ s.desc }}
              </p>
            </div>
          </li>
        </ol>
        <p class="mt-5 text-[13px] font-semibold text-gold-ink">
          Delivery orders from $500 &nbsp;·&nbsp; Will-call on select items
        </p>
      </div>

      <!-- Right: quote form -->
      <div
        v-reveal="80"
        class="reveal"
      >
        <!-- Confirmation (replaces the form on success) -->
        <div
          v-if="status === 'success'"
          class="rounded-form border border-[#e2dccf] bg-paper p-6 text-center shadow-form sm:p-9"
        >
          <span
            class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              class="h-7 w-7 text-gold-ink"
            >
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <h3
            ref="confirmationRef"
            tabindex="-1"
            class="font-display text-[26px] leading-tight text-ink"
          >
            Request received
          </h3>
          <p class="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
            Thanks{{ form.name ? `, ${form.name}` : '' }} — we'll reply within one business day with an
            itemized quote.
          </p>
          <button
            type="button"
            class="btn mt-6 border-field text-ink-soft transition-colors hover:border-gold-mid hover:text-ink"
            @click="resetForm"
          >
            Send another request
          </button>
        </div>

        <!-- The form -->
        <form
          v-else
          method="post"
          action="/api/quote"
          class="rounded-form border border-[#e2dccf] bg-paper p-6 shadow-form sm:p-9"
          :novalidate="enhanced || undefined"
          aria-labelledby="quote-form-heading"
          @submit.prevent="handleSubmit"
        >
          <!-- Spam guards: honeypot (only bots fill it) + a render-time stamp
               (time-trap). Hidden from users + assistive tech, not tabbable. -->
          <div
            class="hp-field"
            aria-hidden="true"
          >
            <label>
              Company URL
              <input
                v-model="form.company_url"
                type="text"
                name="company_url"
                tabindex="-1"
                autocomplete="off"
              />
            </label>
          </div>
          <input
            type="hidden"
            name="form_ts"
            :value="form.form_ts"
          />

          <h3
            id="quote-form-heading"
            class="font-display text-[26px] leading-none text-ink"
          >
            Request a quote
          </h3>
          <p class="mt-2 text-[13px] text-muted">
            We reply within one business day.
          </p>
          <p class="mt-1 text-xs text-faint">
            Fields marked <span class="req-star" aria-hidden="true">*</span> are required.
          </p>
          <div class="my-6 h-px bg-divider"></div>

          <!-- Error summary -->
          <div
            v-if="submitAttempted && hasErrors"
            ref="summaryRef"
            tabindex="-1"
            class="error-summary"
            :data-shake="shake ? 'true' : 'false'"
            aria-labelledby="error-summary-title"
          >
            <p
              id="error-summary-title"
              class="error-summary__title"
            >
              <IconAlert class="h-4 w-4 shrink-0" />
              Please fix the following:
            </p>
            <ul class="mt-2 list-disc space-y-1 pl-5 text-[13px]">
              <li
                v-for="err in summaryErrors"
                :key="err.key"
              >
                <a
                  :href="`#${err.id}`"
                  @click.prevent="focusField(err.id)"
                >
                  {{ err.message }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Date + guests -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                for="qf-date"
                class="label"
              >
                Event date <span class="req-star" aria-hidden="true">*</span>
              </label>
              <input
                id="qf-date"
                v-model="form.eventDate"
                name="eventDate"
                type="date"
                class="field"
                required
                aria-required="true"
                :min="minDate"
                :aria-invalid="errors.eventDate ? 'true' : undefined"
                :aria-describedby="errors.eventDate ? 'qf-date-error' : undefined"
                @blur="handleBlur('eventDate')"
                @input="handleInput('eventDate')"
              />
              <p
                v-if="errors.eventDate"
                id="qf-date-error"
                class="field-error"
              >
                <IconAlert /> {{ errors.eventDate }}
              </p>
            </div>
            <div>
              <label
                for="qf-guests"
                class="label"
              >
                Guest count <span class="req-star" aria-hidden="true">*</span>
              </label>
              <input
                id="qf-guests"
                v-model="form.guests"
                name="guests"
                type="number"
                min="1"
                step="1"
                inputmode="numeric"
                placeholder="120"
                class="field"
                required
                aria-required="true"
                :aria-invalid="errors.guests ? 'true' : undefined"
                :aria-describedby="errors.guests ? 'qf-guests-error' : undefined"
                @blur="handleBlur('guests')"
                @input="handleInput('guests')"
              />
              <p
                v-if="errors.guests"
                id="qf-guests-error"
                class="field-error"
              >
                <IconAlert /> {{ errors.guests }}
              </p>
            </div>
          </div>

          <!-- Items (native checkboxes styled as chips) -->
          <fieldset
            class="mt-4 border-0 p-0"
            :aria-describedby="errors.items ? 'qf-items-error' : undefined"
          >
            <legend class="label">
              Items needed <span class="req-star" aria-hidden="true">*</span>
            </legend>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="(item, i) in itemOptions"
                :key="item"
                class="chip-check"
              >
                <input
                  :id="`qf-item-${i}`"
                  v-model="form.items"
                  type="checkbox"
                  name="items"
                  class="sr-only"
                  :value="item"
                  @change="handleItemsChange"
                />
                <span>
                  {{ item }}
                </span>
              </label>
            </div>
            <p
              v-if="errors.items"
              id="qf-items-error"
              class="field-error"
            >
              <IconAlert /> {{ errors.items }}
            </p>
          </fieldset>

          <!-- Address -->
          <div class="mt-4">
            <label
              for="qf-address"
              class="label"
            >
              Delivery address <span class="req-star" aria-hidden="true">*</span>
            </label>
            <input
              id="qf-address"
              v-model="form.address"
              name="address"
              type="text"
              autocomplete="street-address"
              placeholder="Rockville, MD 20850"
              class="field"
              required
              aria-required="true"
              :aria-invalid="errors.address ? 'true' : undefined"
              :aria-describedby="errors.address ? 'qf-address-error' : undefined"
              @blur="handleBlur('address')"
              @input="handleInput('address')"
            />
            <p
              v-if="errors.address"
              id="qf-address-error"
              class="field-error"
            >
              <IconAlert /> {{ errors.address }}
            </p>
          </div>

          <!-- Name -->
          <div class="mt-4">
            <label
              for="qf-name"
              class="label"
            >
              Full name <span class="req-star" aria-hidden="true">*</span>
            </label>
            <input
              id="qf-name"
              v-model="form.name"
              name="name"
              type="text"
              autocomplete="name"
              placeholder="Your name"
              class="field"
              required
              aria-required="true"
              :aria-invalid="errors.name ? 'true' : undefined"
              :aria-describedby="errors.name ? 'qf-name-error' : undefined"
              @blur="handleBlur('name')"
              @input="handleInput('name')"
            />
            <p
              v-if="errors.name"
              id="qf-name-error"
              class="field-error"
            >
              <IconAlert /> {{ errors.name }}
            </p>
          </div>

          <!-- Email + phone -->
          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                for="qf-email"
                class="label"
              >
                Email <span class="req-star" aria-hidden="true">*</span>
              </label>
              <input
                id="qf-email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                placeholder="you@email.com"
                class="field"
                required
                aria-required="true"
                :aria-invalid="errors.email ? 'true' : undefined"
                :aria-describedby="errors.email ? 'qf-email-error' : undefined"
                @blur="handleBlur('email')"
                @input="handleInput('email')"
              />
              <p
                v-if="errors.email"
                id="qf-email-error"
                class="field-error"
              >
                <IconAlert /> {{ errors.email }}
              </p>
            </div>
            <div>
              <label
                for="qf-phone"
                class="label"
              >
                Phone <span class="req-star" aria-hidden="true">*</span>
              </label>
              <input
                id="qf-phone"
                v-model="form.phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                inputmode="tel"
                placeholder="(240) 555-0142"
                class="field"
                required
                aria-required="true"
                :aria-invalid="errors.phone ? 'true' : undefined"
                :aria-describedby="errors.phone ? 'qf-phone-error' : undefined"
                @blur="handleBlur('phone')"
                @input="handleInput('phone')"
              />
              <p
                v-if="errors.phone"
                id="qf-phone-error"
                class="field-error"
              >
                <IconAlert /> {{ errors.phone }}
              </p>
            </div>
          </div>

          <!-- Notes (optional) -->
          <div class="mt-4">
            <label
              for="qf-notes"
              class="label"
            >
              Event details <span class="font-normal text-faint">(optional)</span>
            </label>
            <textarea
              id="qf-notes"
              v-model="form.notes"
              name="notes"
              rows="3"
              placeholder="Tell us about the venue, vibe, and anything special."
              class="field resize-y"
            ></textarea>
          </div>

          <button
            type="submit"
            class="btn btn--dark btn--block mt-6 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="isSubmitting"
            :aria-busy="isSubmitting ? 'true' : undefined"
          >
            <template v-if="isSubmitting">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                class="h-4 w-4 animate-spin"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  stroke-width="3"
                  opacity="0.25"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                />
              </svg>
              Sending…
            </template>
            <template v-else>
              Request my quote →
            </template>
          </button>

          <!-- Submit-time (network/backend) error -->
          <p
            v-if="status === 'error'"
            ref="submitErrorRef"
            tabindex="-1"
            role="alert"
            class="submit-error"
          >
            <IconAlert class="h-4 w-4 shrink-0" /> {{ submitError }}
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [{
  n: '01',
  title: 'Tell us about your event',
  desc: 'Date, guest count, and the pieces you love.'
}, {
  n: '02',
  title: 'We build your quote',
  desc: 'Itemized and sent within one business day.'
}, {
  n: '03',
  title: 'We deliver & set',
  desc: 'On time, styled, and collected after.'
}];

const itemOptions = ['Tables', 'Chairs', 'Linens', 'Lounge', 'Bar', 'Dance floor'];

const {
  form,
  errors,
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
  resetForm
} = useQuoteForm();
</script>
