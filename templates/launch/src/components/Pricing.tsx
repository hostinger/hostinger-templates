"use client";

import { useState } from "react";
import pricingData from "@/content/pricing.json";
import { siteContent } from "@/content/site";
import type { BillingCycle, FeatureRow, Plan } from "@/types";

const plans = pricingData.plans as Plan[];
const features = pricingData.features as FeatureRow[];

function FeatureValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return <span aria-label={siteContent.pricing.included}>✓</span>;
  }
  if (value === false) {
    return <span className="not-included" aria-label={siteContent.pricing.unavailable}>—</span>;
  }
  return <span>{value}</span>;
}

export function Pricing() {
  const [billing, setBilling] = useState<BillingCycle>("annual");
  const isAnnual = billing === "annual";

  return (
    <section className="pricing section-pad" id="pricing">
      <div className="pricing-head">
        <div className="section-heading">
          <p className="eyebrow">{siteContent.pricing.eyebrow}</p>
          <h2>{siteContent.pricing.title}</h2>
          <p>{siteContent.pricing.intro}</p>
        </div>
        <div className="billing-control">
          <div className="billing-toggle" aria-label="Billing cycle">
            {(["monthly", "annual"] as BillingCycle[]).map((cycle) => (
              <button
                type="button"
                key={cycle}
                className={billing === cycle ? "active" : ""}
                aria-pressed={billing === cycle}
                onClick={() => setBilling(cycle)}
              >
                {pricingData.cycles[cycle]}
              </button>
            ))}
          </div>
          <strong>{pricingData.annualNote}</strong>
        </div>
      </div>

      <div className="plans">
        {plans.map((plan) => {
          const price = isAnnual ? plan.annualMonthlyPrice : plan.monthlyPrice;
          const annualSaving = (plan.monthlyPrice - plan.annualMonthlyPrice) * 12;

          return (
            <article className={`plan ${plan.recommended ? "recommended" : ""}`} key={plan.id}>
              {plan.recommended && <div className="plan-flag">{siteContent.pricing.recommended}</div>}
              <p className="plan-eyebrow">{plan.eyebrow}</p>
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <div className="price">
                <span>{pricingData.currency}</span>
                <strong>{price}</strong>
                <small>{pricingData.priceSuffix}</small>
              </div>
              <p className="billing-detail">
                {isAnnual
                  ? `${pricingData.annualBillingNote} · Save ${pricingData.currency}${annualSaving}/year`
                  : "\u00a0"}
              </p>
              <a
                className={`button ${plan.recommended ? "button-orange" : ""}`}
                href="#waitlist"
              >
                {plan.cta}
              </a>
            </article>
          );
        })}
      </div>

      <div className="comparison">
        <h3>{siteContent.pricing.comparisonTitle}</h3>
        <div className="feature-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">{siteContent.pricing.comparisonTitle}</th>
                {plans.map((plan) => (
                  <th scope="col" key={plan.id}>{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.name}>
                  <th scope="row">
                    {feature.name}
                    <small>{feature.description}</small>
                  </th>
                  {plans.map((plan) => (
                    <td key={plan.id}>
                      <FeatureValue value={feature.values[plan.id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="feature-cards">
          {plans.map((plan) => (
            <article key={plan.id}>
              <h4>{plan.name}</h4>
              <dl>
                {features.map((feature) => (
                  <div key={feature.name}>
                    <dt>{feature.name}</dt>
                    <dd><FeatureValue value={feature.values[plan.id]} /></dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
