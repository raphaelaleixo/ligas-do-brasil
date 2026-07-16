# ligas-do-brasil-issues (Cloudflare Worker)

Receives POSTs from the Ligas do Brasil feedback form, verifies the
Turnstile token, and creates an issue in `raphaelaleixo/ligas-do-brasil`
with the `submitted-via-web` label.

## Files

- `src/worker.js` — the worker
- `wrangler.toml` — config (non-secret vars)
- `.dev.vars.example` — template for local secrets (committed)
- `.dev.vars` — actual local secrets (**gitignored**)

## Local dev

1. `cp .dev.vars.example .dev.vars` and fill in `GITHUB_TOKEN` +
   `TURNSTILE_SECRET`.
2. `npx wrangler dev` — starts the worker at `http://localhost:8787`.
3. Point the site's frontend fetch at that URL for local testing.

## Deploy

1. `npx wrangler deploy` — pushes the worker to Cloudflare. First run
   creates the deployment; the URL is
   `https://ligas-do-brasil-issues.<your-subdomain>.workers.dev`.
2. Set the two secrets (only needed once, or after rotation):

   ```sh
   npx wrangler secret put GITHUB_TOKEN
   npx wrangler secret put TURNSTILE_SECRET
   ```

   Each prompts interactively — paste the value, it's stored encrypted on
   Cloudflare's side and never touches the repo.
3. Confirm it's live: `npx wrangler tail` and hit the URL with a test POST.

## Rotating secrets

- **GitHub PAT:** revoke at
  `github.com/settings/personal-access-tokens`, generate a new one with
  the same scope (Issues: read + write on `raphaelaleixo/ligas-do-brasil`),
  then `npx wrangler secret put GITHUB_TOKEN`.
- **Turnstile secret:** Cloudflare dashboard → Turnstile → widget →
  Settings → Rotate Secret Key. Then `npx wrangler secret put TURNSTILE_SECRET`.
- Also update `worker/.dev.vars` if you plan to run `wrangler dev` locally.

## Behavior

- Only POSTs from origins listed in `ALLOWED_ORIGINS` are accepted.
- Bots that fill the hidden `website` (honeypot) field get a fake success.
- Turnstile token verified server-side; missing/failed → 403.
- `title` + `message` are required; length-capped (200/5000 chars). `name`
  is optional (80 chars, Markdown-escaped in the issue body).
- On success, returns `{ ok: true, url, number }` (201). On upstream
  error, returns `{ error: "upstream_error" }` (502) — real detail is
  logged, not leaked to the browser.
