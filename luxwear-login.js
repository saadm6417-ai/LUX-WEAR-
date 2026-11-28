import { supabase } from './luxwear-supabase.js';

const form = document.getElementById('form');
const errorBox = document.getElementById('error');
const emailField = document.getElementById('username');
const passwordField = document.getElementById('password');
const submit = form?.querySelector('.submit');

if (emailField) {
  emailField.type = 'email';
  emailField.autocomplete = 'username';
  emailField.placeholder = 'أدخل البريد الإلكتروني';
  const label = document.querySelector('label[for="username"]');
  if (label) label.textContent = 'البريد الإلكتروني';
}
if (new URLSearchParams(location.search).has('access')) {
  errorBox.textContent = 'هذا الحساب غير مصرح له بدخول لوحة التحكم.';
}
const { data: { session } } = await supabase.auth.getSession();
if (session) {
  const { data: admin } = await supabase.from('admin_users').select('user_id').eq('user_id',session.user.id).maybeSingle();
  if (admin) location.replace('admin-dashboard.html');
}
form?.addEventListener('submit', async event => {
  event.preventDefault();
  event.stopImmediatePropagation();
  const email = emailField.value.trim();
  const password = passwordField.value;
  if (!email || !password) return;
  submit.disabled = true;
  submit.textContent = 'جارٍ التحقق...';
  errorBox.textContent = '';
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    errorBox.textContent = 'تعذر تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.';
    submit.disabled = false;
    submit.textContent = 'تسجيل الدخول';
    return;
  }
  const { data: admin, error: adminError } = await supabase.from('admin_users')
    .select('user_id').eq('user_id', data.user.id).maybeSingle();
  if (adminError || !admin) {
    await supabase.auth.signOut();
    errorBox.textContent = 'هذا الحساب غير مضاف ضمن مستخدمي إدارة LUX WEAR.';
    submit.disabled = false;
    submit.textContent = 'تسجيل الدخول';
    return;
  }
  location.replace('admin-dashboard.html');
}, true);
