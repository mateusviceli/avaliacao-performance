// ═══════════════════════════════════════════════════════════════════
// CONFIG — Avaliação de Performance v2
// Edite apenas este arquivo. Os demais leem daqui.
// ═══════════════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://zlvxyiwovzktivftzejq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsdnh5aXdvdnprdGl2ZnR6ZWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjkwNDQsImV4cCI6MjA5ODQwNTA0NH0.5hahJXlsFvpLG3tU2WG2rcGhzeGbbEmeeuyaqCq3-RM';

// Senha do Gestor do Projeto (acesso total)
const GP_SENHA = 'segula2025';

// ── Supabase helpers ────────────────────────────────────────────────
const SB = {
  headers() {
    return {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    };
  },

  async get(table, params = '') {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}${params}`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  },

  async post(table, body) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST', headers: this.headers(), body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(await r.text());
    const t = await r.text(); return t ? JSON.parse(t) : null;
  },

  async patch(table, id, body) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: 'PATCH', headers: this.headers(), body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(await r.text());
    const t = await r.text(); return t ? JSON.parse(t) : null;
  },
};

// ── Utilitários ─────────────────────────────────────────────────────
function gerarCodigo(n = 8) {
  return Math.random().toString(36).slice(2, 2 + n).toUpperCase();
}

function avg(arr) {
  const v = (arr || []).filter(x => x != null && !isNaN(x));
  return v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(2) : null;
}

function fmtData(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

function statusLabel(etapa, status) {
  if (status === 'concluida') return { txt: 'Concluída', cls: 'concluida' };
  const map = {
    1: { txt: 'Aguardando Gestor Cliente', cls: 'etapa1' },
    2: { txt: 'Aguardando Colaborador',    cls: 'etapa2' },
    3: { txt: 'Em Revisão pelo GP',        cls: 'etapa3' },
    4: { txt: 'Em Revisão pelo GP',        cls: 'etapa3' },
  };
  return map[etapa] || { txt: '—', cls: '' };
}

// Nota numérica → rótulo
function notaTxt(n) {
  if (n == null) return '—';
  if (n >= 3.5) return 'Acima do esperado';
  if (n >= 2.5) return 'Dentro do esperado';
  if (n >= 1.5) return 'Em desenvolvimento';
  return 'Não atende';
}

function notaCls(n) {
  if (n == null) return 'nota-0';
  if (n >= 3.5) return 'nota-4';
  if (n >= 2.5) return 'nota-3';
  if (n >= 1.5) return 'nota-2';
  return 'nota-1';
}

// Toast global
function showToast(msg, type = 'success') {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = (type === 'success' ? '✅ ' : '❌ ') + msg;
  t.className = `toast ${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 4000);
}

// URL param helper
function urlParam(key) {
  return new URLSearchParams(location.search).get(key);
}
