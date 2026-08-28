import type { MetaFunction } from "react-router";
import { Link, useParams } from "react-router";

import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { ShapeBuddy } from "~/components/ShapeBuddy";
import { TeamChip } from "~/components/TeamChip";
import { ArrowRight } from "~/icons/ArrowRight";
import type { Role } from "~/types/content";
import { buildApplyMailto, buildQuestionMailto } from "~/utils/apply";
import { getRoleBySlug, getTeamHue, site } from "~/utils/content";

export const meta: MetaFunction = ({ params }) => {
  const role = getRoleBySlug(params.slug ?? "");
  if (!role) {
    return [{ title: `${site.rolePage.notFoundTitle} — ${site.companyName}` }];
  }
  return [
    { title: `${role.title} — ${site.companyName} careers` },
    { name: "description", content: role.oneLiner },
  ];
};

function RoleNotFound() {
  return (
    <div className="page">
      <Header />
      <main className="shell role-main">
        <div className="notfound">
          <h1 className="notfound-title">{site.rolePage.notFoundTitle}</h1>
          <p className="notfound-body">{site.rolePage.notFoundBody}</p>
          <Link className="button button-primary" to="/#roles">
            {site.rolePage.backLabel}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function RoleHero({ role }: { role: Role }) {
  const applyHref = buildApplyMailto(site.email, role);
  return (
    <header className="role-hero">
      <div className="role-hero-copy">
        <div className="role-card-chips">
          <TeamChip team={role.team} />
          <span className="policy-chip">
            {site.policyLabels[role.remotePolicy]}
          </span>
        </div>
        <h1 className="role-title">{role.title}</h1>
        <p className="role-liner">{role.oneLiner}</p>
        <p className="role-meta">
          <span>{role.location}</span>
          {role.salaryRange && <span>{role.salaryRange}</span>}
        </p>
        <div className="role-apply">
          <a className="button button-primary" href={applyHref}>
            {site.rolePage.applyLabel}
          </a>
          <p className="apply-note">
            {site.rolePage.applyNote}{" "}
            <a href={applyHref}>{site.email}</a>.
          </p>
        </div>
      </div>
      <ShapeBuddy hue={getTeamHue(role.team)} />
    </header>
  );
}

export default function RolePage() {
  const params = useParams();
  const role = getRoleBySlug(params.slug ?? "");

  if (!role) {
    return <RoleNotFound />;
  }

  const applyHref = buildApplyMailto(site.email, role);
  const questionHref = buildQuestionMailto(site.email, role);

  return (
    <div className="page">
      <Header />
      <main className="shell role-main">
        <Link className="back-link" to="/#roles">
          <ArrowRight />
          {site.rolePage.backLabel}
        </Link>

        <RoleHero role={role} />

        <div className="role-body">
          <div className="role-sections">
            <section className="role-section" aria-labelledby="do-title">
              <h2 id="do-title" className="role-section-title">
                {site.rolePage.doTitle}
              </h2>
              <ul className="do-list">
                {role.whatYoudDo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="role-section" aria-labelledby="dont-title">
              <h2 id="dont-title" className="role-section-title">
                {site.rolePage.dontTitle}
              </h2>
              <ul className="wont-list">
                {role.whatYouWont.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="role-section" aria-labelledby="hire-title">
              <h2 id="hire-title" className="role-section-title">
                {site.rolePage.hireTitle}
              </h2>
              <ol className="hire-steps">
                {role.howWeHire.map((step, index) => (
                  <li className="hire-step" key={step.title}>
                    <span className="hire-step-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="hire-step-title">{step.title}</h3>
                      <p className="hire-step-detail">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="role-aside">
            <section className="aside-card" aria-labelledby="about-title">
              <h2 id="about-title" className="aside-title">
                {site.rolePage.aboutTitle}
              </h2>
              <p className="aside-body">{site.rolePage.aboutBody}</p>
            </section>
            <section
              className="aside-card aside-card-question"
              aria-labelledby="questions-title"
            >
              <h2 id="questions-title" className="aside-title">
                {site.rolePage.questionsTitle}
              </h2>
              <p className="aside-body">{site.rolePage.questionsBody}</p>
              <a className="aside-link" href={questionHref}>
                {site.rolePage.questionsCtaLabel}
                <ArrowRight />
              </a>
            </section>
          </aside>
        </div>

        <section className="role-bottom" aria-label={site.rolePage.applyLabel}>
          <h2 className="role-bottom-title">{site.rolePage.bottomTitle}</h2>
          <div className="role-bottom-actions">
            <a className="button button-primary" href={applyHref}>
              {site.rolePage.applyLabel}
            </a>
            <a className="button button-ghost-dark" href={questionHref}>
              {site.rolePage.questionsCtaLabel}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
