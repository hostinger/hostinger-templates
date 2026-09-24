import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { FormField } from '../components/FormField';
import { neighbourhoods, settingOptions, site } from '../constants/content';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { CheckIcon, MailIcon } from '../icons';
import { mailtoHref } from '../utils/contact';
import { fillTemplate } from '../utils/format';
import {
  EMPTY_LISTING,
  LISTING_LIMITS,
  listingMailto,
  validateListing,
  type ListingErrors,
  type ListingForm,
} from '../utils/listing';

const FIELD_ORDER: (keyof ListingForm)[] = ['clubName', 'contactName', 'email', 'phone', 'neighbourhood', 'courts', 'setting'];

export function ListClubPage() {
  const { listing } = site;
  useDocumentTitle(listing.title);
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<ListingForm>(EMPTY_LISTING);
  const [errors, setErrors] = useState<ListingErrors>({});
  const [sentHref, setSentHref] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (errors[name as keyof ListingForm]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateListing(form);
    setErrors(nextErrors);

    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    const href = listingMailto(form);
    setSentHref(href);
    window.location.href = href;
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className="listing">
      <header className="page-hero page-hero--turf">
        <div className="page-hero__inner">
          <p className="eyebrow eyebrow--on-dark">{listing.eyebrow}</p>
          <h1 className="page-hero__title">{listing.title}</h1>
          <p className="page-hero__intro">{listing.intro}</p>
        </div>
      </header>

      <div className="listing__body">
        <ol className="step-list">
          {listing.steps.map((step, index) => (
            <li key={step}>
              <span className="step-list__number">{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>

        {sentHref ? (
          <section className="success-panel" role="status" aria-live="polite">
            <CheckIcon width={32} height={32} />
            <h2>{listing.successTitle}</h2>
            <p>{listing.successBody}</p>
            <div className="success-panel__actions">
              <a className="button button--court" href={sentHref}>
                <MailIcon width={18} height={18} />
                Open email again
              </a>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => {
                  setForm(EMPTY_LISTING);
                  setSentHref(null);
                }}
              >
                List another club
              </button>
            </div>
          </section>
        ) : (
          <form ref={formRef} className="listing-form" noValidate onSubmit={handleSubmit}>
            {errorCount > 0 && (
              <p className="listing-form__summary" role="alert">
                Please fix {errorCount === 1 ? 'the highlighted field' : `the ${errorCount} highlighted fields`}.
              </p>
            )}
            <div className="listing-form__grid">
              <FormField id="clubName" label="Club name" error={errors.clubName}>
                {(describedBy) => (
                  <input
                    id="clubName"
                    name="clubName"
                    value={form.clubName}
                    maxLength={LISTING_LIMITS.text}
                    autoComplete="organization"
                    aria-invalid={Boolean(errors.clubName)}
                    aria-describedby={describedBy}
                    onChange={handleChange}
                  />
                )}
              </FormField>
              <FormField id="contactName" label="Your name" error={errors.contactName}>
                {(describedBy) => (
                  <input
                    id="contactName"
                    name="contactName"
                    value={form.contactName}
                    maxLength={LISTING_LIMITS.text}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.contactName)}
                    aria-describedby={describedBy}
                    onChange={handleChange}
                  />
                )}
              </FormField>
              <FormField id="email" label="Email" error={errors.email}>
                {(describedBy) => (
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    maxLength={LISTING_LIMITS.text}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={describedBy}
                    onChange={handleChange}
                  />
                )}
              </FormField>
              <FormField id="phone" label="Phone" optional error={errors.phone}>
                {(describedBy) => (
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    maxLength={LISTING_LIMITS.phone}
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={describedBy}
                    onChange={handleChange}
                  />
                )}
              </FormField>
              <FormField id="neighbourhood" label="Area" error={errors.neighbourhood}>
                {(describedBy) => (
                  <select
                    id="neighbourhood"
                    name="neighbourhood"
                    value={form.neighbourhood}
                    aria-invalid={Boolean(errors.neighbourhood)}
                    aria-describedby={describedBy}
                    onChange={handleChange}
                  >
                    <option value="">Choose an area</option>
                    {neighbourhoods.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                )}
              </FormField>
              <FormField id="courts" label="Number of courts" error={errors.courts}>
                {(describedBy) => (
                  <input
                    id="courts"
                    name="courts"
                    type="number"
                    inputMode="numeric"
                    min={LISTING_LIMITS.minCourts}
                    max={LISTING_LIMITS.maxCourts}
                    value={form.courts}
                    aria-invalid={Boolean(errors.courts)}
                    aria-describedby={describedBy}
                    onChange={handleChange}
                  />
                )}
              </FormField>
            </div>

            <fieldset
              className={`field field--fieldset${errors.setting ? ' field--invalid' : ''}`}
              aria-describedby={errors.setting ? 'setting-error' : undefined}
            >
              <legend className="field__label">Courts are</legend>
              <div className="chips">
                {settingOptions.map((option) => (
                  <label key={option.id} className="chip">
                    <input
                      type="radio"
                      name="setting"
                      value={option.id}
                      checked={form.setting === option.id}
                      onChange={handleChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.setting && (
                <p id="setting-error" className="field__error">
                  {errors.setting}
                </p>
              )}
            </fieldset>

            <FormField
              id="message"
              label="Anything else?"
              optional
              hint="Prices, opening hours, coaching, or a link to your booking page."
            >
              {(describedBy) => (
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  maxLength={LISTING_LIMITS.message}
                  aria-describedby={describedBy}
                  onChange={handleChange}
                />
              )}
            </FormField>

            <p className="listing-form__note">
              {fillTemplate(listing.note, { email: site.contact.email })}{' '}
              <a href={mailtoHref(site.contact.email, listing.emailSubject)}>Email us directly</a>.
            </p>
            <button type="submit" className="button button--ball">
              <MailIcon width={18} height={18} />
              Prepare email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
