import type { Metadata } from "next";
import { FaqSection } from "@/components/FaqSection";
import { org, site } from "@/lib/data";
import { formatDateLong } from "@/lib/format";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: site.settingsPage.title,
};

interface FieldRow {
  label: string;
  value: string;
  mono?: boolean;
}

export default function SettingsPage() {
  const workspaceRows: FieldRow[] = [
    { label: "Organization", value: org.organization.name },
    { label: "Workspace slug", value: org.organization.slug, mono: true },
    { label: "Plan", value: org.organization.plan },
    { label: "Region", value: org.organization.region },
    { label: "Data retention", value: org.organization.dataRetention },
    { label: "Created", value: formatDateLong(org.organization.createdAt) },
  ];

  const profileRows: FieldRow[] = [
    { label: "Name", value: org.profile.name },
    { label: "Email", value: org.profile.email, mono: true },
    { label: "Role", value: org.profile.role },
    { label: "Timezone", value: org.profile.timezone },
    { label: "Two-factor auth", value: org.profile.twoFactor },
  ];

  const apiRows: FieldRow[] = [
    { label: "Environment", value: org.api.environment },
    { label: "Publishable key", value: org.api.publishableKey, mono: true },
    { label: "Signing secret", value: org.api.signingSecret, mono: true },
    { label: "Webhook API version", value: org.api.apiVersion, mono: true },
  ];

  return (
    <div className={styles.page}>
      <header className="page-header">
        <h1 className="page-title">{site.settingsPage.title}</h1>
        <p className="page-sub">{site.settingsPage.subtitle}</p>
      </header>

      <p className={styles.notice} role="note">
        {site.settingsPage.notice}
      </p>

      <div className={styles.grid}>
        <FieldCard title={site.settingsPage.sections.workspace} rows={workspaceRows} headingId="workspace-heading" />
        <FieldCard title={site.settingsPage.sections.profile} rows={profileRows} headingId="profile-heading" />
      </div>

      <FieldCard
        title={site.settingsPage.sections.api}
        note={site.settingsPage.apiNote}
        rows={apiRows}
        headingId="api-heading"
      />

      <FaqSection title={site.faq.title} intro={site.faq.intro} items={site.faq.items} />
    </div>
  );
}

function FieldCard({
  title,
  note,
  rows,
  headingId,
}: {
  title: string;
  note?: string;
  rows: FieldRow[];
  headingId: string;
}) {
  return (
    <section className="panel" aria-labelledby={headingId}>
      <div className="panel-header">
        <h2 className="panel-title" id={headingId}>
          {title}
        </h2>
        {note ? <p className="panel-sub">{note}</p> : null}
      </div>
      <dl className={styles.fields}>
        {rows.map((row) => (
          <div key={row.label} className={styles.fieldRow}>
            <dt className={styles.fieldLabel}>{row.label}</dt>
            <dd className={row.mono ? `${styles.fieldValue} ${styles.fieldValueMono}` : styles.fieldValue}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
