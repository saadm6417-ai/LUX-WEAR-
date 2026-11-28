import { supabase } from './luxwear-supabase.js';

const form = document.getElementById('reviewForm');
const errorBox = document.getElementById('errorMsg');
const submitButton = document.getElementById('submitBtn');
const finish = document.getElementById('finish');
const copy = {
  ar: { sending: 'جارٍ إرسال التقييم...', sendError: 'حصلت مشكلة أثناء حفظ التقييم. حاول مرة أخرى.' },
  en: { sending: 'Submitting your review...', sendError: 'There was a problem saving your review. Please try again.' }
};

form?.addEventListener('submit', async event => {
  event.preventDefault();
  event.stopImmediatePropagation();
  if (!form.reportValidity()) return;
  const language = document.documentElement.lang === 'en' ? 'en' : 'ar';
  const messages = copy[language];
  const values = new FormData(form);
  const answers = {};
  for (let i = 1; i <= 11; i++) answers['q' + i] = String(values.get('q' + i) || '').trim();
  const customerName = String(values.get('customerName') || '').trim();
  const phone = String(values.get('phone') || '').trim();
  submitButton.disabled = true;
  submitButton.textContent = messages.sending;
  errorBox.style.display = 'none';

  const { error } = await supabase.from('customer_reviews').insert({
    customer_name: customerName,
    phone,
    language,
    answers,
    status: 'new'
  });

  if (error) {
    console.error('LUX WEAR survey save failed:', error);
    submitButton.disabled = false;
    submitButton.textContent = language === 'en' ? 'Submit Review' : 'إرسال التقييم';
    errorBox.textContent = messages.sendError;
    errorBox.style.display = 'block';
    return;
  }

  // Keep the existing Google Sheets integration as a secondary copy.
  try {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzMbRgOUfrRBVJDVdCDr803be3uY-vLuKZc-pBVtyGrUT5cbD69tVDa9jaxnwyXjy29/exec';
    const legacy = { customerName, phone, submittedAt: new Date().toISOString(), ...answers };
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(legacy)
    }).catch(err => console.warn('Google Sheets secondary copy failed:', err));
  } catch (err) {
    console.warn('Google Sheets secondary copy failed:', err);
  }

  form.style.display = 'none';
  finish.style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}, true);
