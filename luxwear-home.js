import { supabase } from './luxwear-supabase.js';

const safeHref = value => {
  const url = String(value || '').trim();
  if (!url || /^(javascript|data|vbscript):/i.test(url)) return null;
  if (/^(https?:|mailto:|tel:|#|\/|\.\/|\.\.\/)/i.test(url)) return url;
  return null;
};

function applyTexts(texts) {
  if (!texts || typeof texts !== 'object') return;
  for (const [key, value] of Object.entries(texts)) {
    const nodes = [];
    const byId = document.getElementById(key);
    if (byId) nodes.push(byId);
    document.querySelectorAll('[data-ar]').forEach(node => {
      if (node.dataset.ar === key) nodes.push(node);
    });
    const ar = typeof value === 'string' ? value : value?.ar;
    const en = typeof value === 'object' ? value?.en : undefined;
    nodes.forEach(node => {
      if (ar !== undefined) node.dataset.ar = String(ar);
      if (en !== undefined) node.dataset.en = String(en);
      const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
      const current = lang === 'en' ? en : ar;
      if (current !== undefined) node.textContent = String(current);
    });
  }
}

function applyLinks(links) {
  if (!links || typeof links !== 'object') return;
  for (const [key, value] of Object.entries(links)) {
    const href = typeof value === 'string' ? value : value?.url;
    const safe = safeHref(href);
    if (!safe) continue;
    const anchor = document.getElementById(key) || [...document.querySelectorAll('a')].find(a =>
      a.getAttribute('href') === key || a.textContent.trim() === key
    );
    if (anchor?.tagName === 'A') anchor.setAttribute('href', safe);
  }
}

async function applyHomepage() {
  const { data, error } = await supabase.from('luxwear_content')
    .select('payload,is_published').eq('content_key', 'homepage').maybeSingle();
  if (error) { console.warn('LUX WEAR homepage settings unavailable:', error); return; }
  if (!data?.is_published || !data.payload) return;
  applyTexts(data.payload.texts);
  applyLinks(data.payload.links);
}

async function applyHours() {
  const schedule = window.luxWeeklyHours;
  if (!schedule) return;
  const { data, error } = await supabase.from('store_hours')
    .select('day_of_week,is_closed,open_time,close_time').order('day_of_week');
  if (error) { console.warn('LUX WEAR homepage hours unavailable:', error); return; }
  for (const row of data || []) {
    const toMinutes = value => {
      if (!value) return 0;
      const [h, m] = String(value).split(':').map(Number);
      return h * 60 + m;
    };
    schedule[Number(row.day_of_week)] = row.is_closed
      ? { open: 0, close: 0, closed: true }
      : { open: toMinutes(row.open_time), close: toMinutes(row.close_time), closed: false };
  }
  window.luxUpdateHours?.();
}

await Promise.all([applyHomepage(), applyHours()]);
