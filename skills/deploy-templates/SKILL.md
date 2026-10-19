---
name: deploy-nodejs-templates
description: Redeploys or troubleshoots template demos on <id>.hostingertemplates.com through the Deploy template demos GitHub workflow. New templates deploy automatically when their PR is merged, so never deploy them by hand. Use when a demo is broken or stale, a deploy run failed, or demos need refreshing.
---

# Template demos on Hostinger

Every template has a public demo at `https://<id>.hostingertemplates.com`, a
subdomain of the `hostingertemplates.com` website. The catalog `demoUrl` is
set to that URL in the PR that adds the template.

`.github/workflows/deploy-template-demos.yml` publishes demos:

- On merge to `main`, it deploys every template whose
  `templates/<id>/package.json` the push added. Changes to existing templates
  (Dependabot security groups, dependency bumps, fixes) do not deploy.
- From the Actions tab ("Run workflow"), it redeploys the template IDs given.

Do not deploy demos with the Hostinger connector or MCP tools while the
workflow can do it.

## Redeploy demos

```bash
gh workflow run deploy-template-demos.yml --ref main -f templates="callout quickstart"
sleep 5
gh run watch "$(gh run list --workflow deploy-template-demos.yml --limit 1 --json databaseId --jq '.[0].databaseId')"
```

The run summary lists every template with its URL and result. A template is
done only when it shows `✅ live`.

## Fix a failed deploy

1. Open the failed run and find the template's step output:
   - `build` job failed: the template does not install or build on CI.
     Reproduce locally with `npm ci && npm run build`.
   - `deploy` job, `Node.js build … failed`: the step prints the tail of the
     Hostinger build log. Hostinger runs `npm ci` and the build on Node 22, so
     reproduce with Node 22 before changing anything. Do not trust hPanel's
     AI failure analysis without reproducing it.
   - `deploy` job, `Timed out … waiting for https://…`: the deploy went
     through but the site did not serve the template. New subdomains can need
     a few minutes for DNS and TLS; rerun once before investigating.
   - `401` from the API: the `HOSTINGER_API_TOKEN` secret in the
     `template-demos` environment expired or was revoked. A repository admin
     creates a new token on the account that owns `hostingertemplates.com`
     and replaces the secret.
2. Fix the template in a PR. Merging the fix does not redeploy it, so run the
   workflow for that template after the merge.
3. Confirm `https://<id>.hostingertemplates.com` and one non-home page load.

How the workflow decides between a static and a Node.js deploy:

- Static: no `deploy.entryFile` in the catalog, and the build output
  (`deploy.outputDirectory`, else `dist`, `build`, or `out`) contains
  `index.html`. The output is uploaded and served as files.
- Node.js: everything else. The committed template source is uploaded and
  Hostinger builds and runs it with the catalog `deploy` settings applied.

A template deploys as the wrong type when its catalog `deploy` block or build
output is wrong. Fix the template, not the workflow.

## Manual fallback

Only when GitHub Actions cannot be used, or demos move to another hosting
plan, use the Hostinger connector tools on the account that owns
`hostingertemplates.com`:

1. Moving plans: pick an empty Cloud plan (check each order's websites with
   `order_id`; a broad listing is paginated), create the
   `hostingertemplates.com` website there, and wait until it is ready.
2. For each template, one at a time (concurrent changes on one account fail
   with unfinished-action limits and transient `500`s):
   1. Build it with `npm ci && npm run build`.
   2. Create subdomain `<id>` of `hostingertemplates.com` with directory
      `<id>`, and wait until it is listed.
   3. Static: zip the contents of the build output (`index.html` at the
      archive root) and deploy it with the static website tool to
      `<id>.hostingertemplates.com`.
      Node.js: zip the source without `node_modules`, build output, or
      `preview/`, deploy it with the JavaScript application tool, and poll
      until the deployment is `completed`.
   4. Verify the live URL as in "Fix a failed deploy".
