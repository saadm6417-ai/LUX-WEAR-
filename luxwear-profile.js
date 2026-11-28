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
if(photo) photo.disabled=true;\n\nconst passwordBox=document.createElement('div');passwordBox.style.cssText='margin-top:24px;padding-top:20px;border-top:1px solid #754f58';passwordBox.innerHTML='<h3 style=\"color:#d3a0aa;text-align:center;margin-bottom:16px\">تغيير كلمة المرور</h3><div class=\"filters\"><div><label>كلمة المرور الحالية</label><input id=\"currentPassword\" type=\"password\" autocomplete=\"current-password\"></div><div><label>كلمة المرور الجديدة</label><input id=\"newProfilePassword\" type=\"password\" autocomplete=\"new-password\"></div><div><label>تأكيد كلمة المرور الجديدة</label><input id=\"confirmProfilePassword\" type=\"password\" autocomplete=\"new-password\"></div></div><button id=\"changeProfilePassword\" class=\"btn primary\" type=\"button\">تحديث كلمة المرور</button><div id=\"passwordNotice\" class=\"notice\"></div>';root.querySelector('.card').append(passwordBox);document.getElementById('changeProfilePassword').addEventListener('click',async()=>{const current=document.getElementById('currentPassword').value,n=document.getElementById('newProfilePassword').value,c=document.getElementById('confirmProfilePassword').value,b=document.getElementById('changeProfilePassword'),msg=document.getElementById('passwordNotice');if(n.length<12){msg.textContent='كلمة المرور الجديدة يجب أن تكون 12 حرفًا على الأقل.';return;}if(n!==c){msg.textContent='كلمتا المرور غير متطابقتين.';return;}b.disabled=true;msg.textContent='جارٍ التحقق وتحديث كلمة المرور...';const {error:verifyError}=await supabase.auth.signInWithPassword({email:user.email,password:current});if(verifyError){msg.textContent='كلمة المرور الحالية غير صحيحة.';b.disabled=false;return;}const {error:updateError}=await supabase.auth.updateUser({password:n});msg.textContent=updateError?'تعذر التحديث: '+updateError.message:'تم تغيير كلمة المرور بنجاح.';b.disabled=false;});
