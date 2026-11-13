# Template request

Ask for a new template by creating an issue in the Jira project HSTG with the
label `node-template-request`. The template builder reads only the issue
summary and description, so write every input in the description in this
format (Jira wiki markup):

```text
h3. Template request
*Name:* Walkies
*Template id:* walkies
*Description:* A site for a small dog-walking business: a landing page, a map of walk areas, and a booking flow where owners pick an area, a day and a time slot.
*Who it's for:* A dog walker running small-group walks in two or three areas
*Category:* Business
*Pages:* Multi-page: home, walk areas, booking
*Tech stack:* Sample data only, no backend or accounts
*Language:* TypeScript
*Framework:* React + Vite
*Source repository:*
```

- **Name** and **Description** are required. Leave other fields empty to use
  the defaults in [UNATTENDED.md](UNATTENDED.md).
- **Template id** is optional and becomes the URL of the demo
  (`<id>.hostingertemplates.com`) and of the hostinger.com page
  (`/applications/<id>`). It is permanent.
- **Category** must be one or two of: SaaS, Business, Documentation, Event,
  Portfolio, Marketing, Fitness, E-commerce, Hospitality, Blog, Calculator,
  Dashboard.
- **Source repository** must stay empty for now. Templates are written from
  scratch; partner repositories aren't supported yet.

The builder comments on the issue when it starts, when the PR is open, and
when it stops because something is missing.
