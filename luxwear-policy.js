import { supabase } from './luxwear-supabase.js';

(async () => {
  const { data, error } = await supabase.from('luxwear_content')
    .select('payload,is_published').eq('content_key', 'policy').maybeSingle();
  if (error) { console.warn('LUX WEAR policy content unavailable; showing original page:', error); return; }
  if (!data?.is_published || !Array.isArray(data.payload?.elements)) return;

  const nodes = [...document.querySelectorAll('#policy [data-ar][data-en]')];
  data.payload.elements.forEach((entry, index) => {
    const node = entry?.id
      ? document.getElementById(entry.id)
      : nodes[index];
    if (!node) return;
    const ar = entry.ar ?? entry.text_ar;
    const en = entry.en ?? entry.text_en;
    if (ar !== undefined) node.dataset.ar = String(ar);
    if (en !== undefined) node.dataset.en = String(en);
    const lang = document.documentElement.lang === 'en' ? 'en' : 'ar';
    const value = lang === 'en' ? en : ar;
    if (value !== undefined) node.textContent = String(value);
  });
})();
