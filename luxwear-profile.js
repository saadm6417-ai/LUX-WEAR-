import { supabase, requireLuxAdmin } from './luxwear-supabase.js';

const session = await requireLuxAdmin();
if (!session) throw new Error('Admin session required');
const root = document.getElementById('profile');
if (!root) throw new Error('Profile section missing');
const inputs = root.querySelectorAll('input');
const name = inputs[0], phone = inputs[1], email = inputs[2], photo = inputs[3];
const save = root.querySelector('button');
const note = document.createElement('div');
note.className = 'notice';
save.insertAdjacentElement('afterend',note);
const { data: { user }, error } = await supabase.auth.getUser();
if (error) note.textContent='تعذر تحميل بيانات الحساب: '+error.message;
else {
  name.value=user.user_metadata?.full_name||user.user_metadata?.name||'';
  phone.value=user.user_metadata?.phone||'';
  email.value=user.email||'';
}
save.addEventListener('click',async()=>{
  save.disabled=true; note.textContent='جارٍ حفظ الملف الشخصي...';
  const { error } = await supabase.auth.updateUser({
    email: email.value.trim() || undefined,
    data: { full_name:name.value.trim(), phone:phone.value.trim() }
  });
  if(error) note.textContent='فشل الحفظ: '+error.message;
  else note.textContent='تم حفظ الاسم ورقم الهاتف. تغيير البريد قد يتطلب تأكيدًا من رسالة البريد الإلكتروني.';
  save.disabled=false;
});
if(photo) photo.disabled=true;
