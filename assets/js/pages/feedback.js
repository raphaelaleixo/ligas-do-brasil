// Feedback form → Cloudflare Worker → GitHub issue.
// The Turnstile widget script (loaded in feedback.html) auto-injects a
// hidden <input name="cf-turnstile-response"> into the form; FormData picks
// it up along with the visible fields.

// Local dev uses `wrangler dev` on :8787 — match whatever hostname the page
// itself is on (localhost vs 127.0.0.1) so the cross-origin request stays on
// the same host and doesn't hit browser preflight-cache oddities.
// Production uses the deployed Worker's URL — swap the placeholder below
// after `wrangler deploy`.
const WORKER_URL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
  ? `${location.protocol}//${location.hostname}:8787`
  : 'https://ligas-do-brasil-issues.raphaelaleixo.workers.dev';

const form = document.getElementById('feedback-form');
const status = document.getElementById('feedback-status');
const submitBtn = form.querySelector('.feedback__submit');
const originalBtnText = submitBtn.textContent;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus('sending', 'Enviando…');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando…';

  const payload = Object.fromEntries(new FormData(form));

  try {
    const resp = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await resp.json().catch(() => ({}));

    if (resp.ok && result.ok) {
      setStatus('ok', `Enviado! Sua contribuição virou a <a href="${result.url}" target="_blank" rel="noopener noreferrer">issue #${result.number}</a>. Obrigado.`);
      form.reset();
      // Turnstile tokens are single-use; reset so the widget issues a fresh
      // one in case the user wants to send another retorno.
      window.turnstile?.reset();
    } else {
      setStatus('error', errorMessage(result.error) || `Não deu — o servidor respondeu ${resp.status}.`);
      window.turnstile?.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  } catch (err) {
    setStatus('error', `Erro de rede: ${err.message}. Tente novamente.`);
    window.turnstile?.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
});

function setStatus(kind, html) {
  status.innerHTML = html;
  status.className = `feedback__status feedback__status--${kind}`;
}

function errorMessage(code) {
  switch (code) {
    case 'missing_fields':    return 'Preencha assunto e mensagem.';
    case 'missing_turnstile': return 'Complete a verificação anti-bot antes de enviar.';
    case 'turnstile_failed':  return 'A verificação anti-bot falhou. Recarregue e tente de novo.';
    case 'origin_not_allowed':return 'Este site não está autorizado a enviar retornos (configuração do servidor).';
    case 'invalid_json':      return 'Payload inválido — recarregue a página.';
    case 'method_not_allowed':return 'Método não permitido.';
    case 'upstream_error':    return 'O GitHub não aceitou o envio agora. Tente mais tarde.';
    default:                  return null;
  }
}
