import { supabase, requireLuxAdmin } from './luxwear-supabase.js';
const session=await requireLuxAdmin();
if(!session) throw new Error('Admin session required');
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let employees=[];
const note=(s,bad=false)=>{const n=$('employeeNotice');if(n){n.textContent=s;n.style.color=bad?'#e2a0a0':''}};
async function load(){
 note('جارٍ تحميل سجل الموظفين...');
 const {data,error}=await supabase.from('luxwear_content').select('payload').eq('content_key','employees').maybeSingle();
 if(error){note('تعذر تحميل السجل: '+error.message,true);return}
 employees=Array.isArray(data?.payload?.employees)?data.payload.employees:[];
 render();note('تم تحميل '+employees.length+' موظف.');
}
function render(){
 $('employeeRows').innerHTML=employees.map((e,i)=>'<tr><td>'+esc(e.name)+'</td><td>'+esc(e.phone)+'</td><td>'+esc(e.email)+'</td><td>'+esc(e.job)+'</td><td>'+esc(e.createdAt?new Date(e.createdAt).toLocaleDateString('ar-EG'):'—')+'</td><td><button class="btn" data-remove="'+i+'">حذف</button></td></tr>').join('')||'<tr><td colspan="6">لا يوجد موظفون مسجلون.</td></tr>';
}
async function save(){
 const {error}=await supabase.from('luxwear_content').upsert({content_key:'employees',title:'سجل الموظفين',payload:{employees},is_published:false},{onConflict:'content_key'});
 if(error){note('فشل حفظ سجل الموظفين: '+error.message,true);return false}
 return true;
}
$('employeeSave').addEventListener('click',async()=>{
 const name=$('employeeName').value.trim();
 if(!name){note('اسم الموظف مطلوب.',true);return}
 const email=$('employeeEmail').value.trim();
 if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){note('صيغة البريد الإلكتروني غير صحيحة.',true);return}
 employees.push({name,phone:$('employeePhone').value.trim(),email,job:$('employeeJob').value.trim(),createdAt:new Date().toISOString()});
 if(await save()){['employeeName','employeePhone','employeeEmail','employeeJob'].forEach(id=>$(id).value='');render();note('تم حفظ بيانات الموظف.')}
});
$('employeeRows').addEventListener('click',async event=>{
 const b=event.target.closest('[data-remove]');if(!b)return;
 const index=Number(b.dataset.remove);if(!confirm('حذف بيانات هذا الموظف؟'))return;
 employees.splice(index,1);if(await save()){render();note('تم حذف الموظف.')}
});
load();
