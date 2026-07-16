// Cloudflare Worker: receives a form POST from the site, verifies the
// Turnstile token, then creates a GitHub issue via the REST API.
//
// Env (see wrangler.toml [vars] and `wrangler secret put`):
//   GITHUB_TOKEN     — fine-grained PAT, Issues:write on GITHUB_OWNER/GITHUB_REPO
//   GITHUB_OWNER     — repo owner (e.g. "raphaelaleixo")
//   GITHUB_REPO      — repo name  (e.g. "ligas-do-brasil")
//   TURNSTILE_SECRET — Cloudflare Turnstile secret key
//   ALLOWED_ORIGINS  — comma-separated list of Origin values allowed to POST

const MAX_TITLE_LEN = 200;
const MAX_MESSAGE_LEN = 5000;
const MAX_NAME_LEN = 80;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    // Also treat any http://localhost:* or http://127.0.0.1:* origin as allowed
    // in dev — the site's port varies (npx serve picks whatever's free).
    // Not a security risk: Turnstile still gates every real POST.
    const originAllowed = allowed.includes(origin) || isLocalDevOrigin(origin);
    const cors = corsHeaders(originAllowed ? origin : allowed[0] || '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405, cors);
    }
    if (!originAllowed) {
      return json({ error: 'origin_not_allowed' }, 403, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'invalid_json' }, 400, cors);
    }

    // Honeypot: real forms leave this empty. Bots fill every field.
    // Return 200 so the bot thinks it worked and doesn't retry with variations.
    if (body.website && String(body.website).trim().length > 0) {
      return json({ ok: true }, 200, cors);
    }

    // Turnstile verification.
    const token = String(body['cf-turnstile-response'] || '').trim();
    if (!token) return json({ error: 'missing_turnstile' }, 400, cors);

    const tsResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP') || '',
      }),
    });
    const tsData = await tsResp.json();
    if (!tsData.success) {
      return json({ error: 'turnstile_failed', codes: tsData['error-codes'] || [] }, 403, cors);
    }

    // Basic validation + length caps.
    const title = String(body.title || '').trim().slice(0, MAX_TITLE_LEN);
    const message = String(body.message || '').trim().slice(0, MAX_MESSAGE_LEN);
    const name = String(body.name || '').trim().slice(0, MAX_NAME_LEN);
    if (!title || !message) {
      return json({ error: 'missing_fields' }, 400, cors);
    }

    // Build the issue body — Markdown, escapes not needed (GitHub renders MD as-is).
    const attribution = name
      ? `\n\n> Enviado por **${escapeMd(name)}** através do formulário do site.`
      : `\n\n> Enviado anonimamente através do formulário do site.`;
    const issueBody = `${message}${attribution}`;

    const ghResp = await fetch(
      `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/issues`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'ligas-do-brasil-web-form',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body: issueBody,
          labels: ['submitted-via-web'],
        }),
      },
    );

    if (!ghResp.ok) {
      // Don't leak GitHub's response detail to the browser — log server-side
      // (visible in `wrangler tail`) and return a generic error.
      console.error('GitHub API error', ghResp.status, await ghResp.text());
      return json({ error: 'upstream_error' }, 502, cors);
    }

    const issue = await ghResp.json();
    return json({ ok: true, url: issue.html_url, number: issue.number }, 201, cors);
  },
};

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    // Chrome's Private Network Access: preflight from a public/local page
    // fetching to localhost sometimes requires this. Harmless where unused.
    'Access-Control-Allow-Private-Network': 'true',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(payload, status, extraHeaders) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });
}

function isLocalDevOrigin(origin) {
  try {
    const u = new URL(origin);
    return u.protocol === 'http:' && (u.hostname === 'localhost' || u.hostname === '127.0.0.1');
  } catch { return false; }
}

function escapeMd(s) {
  // Prevent the "name" field from injecting Markdown formatting into the
  // attribution line.
  return s.replace(/[\\`*_{}[\]()#+\-.!>]/g, '\\$&');
}
