import { supabase, requireLuxAdmin } from './luxwear-supabase.js';

const session = await requireLuxAdmin();
if (!session) throw new Error('Admin session required');

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const fields = ['spName','spNameEn','spSku','spCategory','spPrice','spOldPrice','spFabric','spCollection','spSizes','spColors','spStock','spImages','spDesc','spDescEn','spVariants','spSeoTitle','spSeo'];
const tabs = {
  categories: { title:'التصنيفات', key:'categories', hint:'قائمة التصنيفات الرئيسية والفرعية بصيغة JSON.' },
  orders: { title:'الطلبات', key:'orders', hint:'لا توجد بوابة طلبات أو دفع مفعّلة حاليًا؛ هذه مساحة تسجيل إدارية وليست استقبال طلبات من العملاء.' },
  discounts: { title:'الخصومات والكوبونات', key:'discounts', hint:'بيانات الكوبونات وشروطها بصيغة JSON.' },
  shipping: { title:'الشحن والتوصيل', key:'shipping', hint:'مناطق ورسوم ومدد الشحن بصيغة JSON.' },
  payments: { title:'طرق الدفع', key:'payments', hint:'إعدادات طرق الدفع. لا يتم تحصيل مدفوعات إلكترونية من هذه الصفحة.' },
  storefront: { title:'واجهة المتجر', key:'storefront', hint:'إعدادات عرض المنتجات والواجهة بصيغة JSON.' }
};
let payload = { products:[], categories:[], orders:[], discounts:[], shipping:[], payments:[], storefront:{} };
let editing = null;
let currentTab = 'products';

function notice(message, bad=false) {
  const node = $('storeNotice');
  if (!node) return;
  node.textContent = message;
  node.style.color = bad ? '#e2a0a0' : '';
}
async function loadStore() {
  notice('جارٍ تحميل بيانات المتجر من Supabase...');
  const { data, error } = await supabase.from('luxwear_content').select('id,payload')
    .eq('content_key','store-management').maybeSingle();
  if (error) { notice('تعذر تحميل بيانات المتجر: '+error.message,true); throw error; }
  if (data?.payload && typeof data.payload === 'object') payload = { ...payload, ...data.payload };
  else {
    const { error: insertError } = await supabase.from('luxwear_content').upsert({
      content_key:'store-management', title:'إدارة المتجر الإلكتروني', payload, is_published:false
    }, { onConflict:'content_key' });
    if (insertError) { notice('تعذر إنشاء مساحة بيانات المتجر: '+insertError.message,true); throw insertError; }
  }
  renderProducts();
  notice('تم تحميل بيانات المتجر من قاعدة البيانات.');
}
async function persist() {
  notice('جارٍ حفظ البيانات...');
  const { error } = await supabase.from('luxwear_content').upsert({
    content_key:'store-management', title:'إدارة المتجر الإلكتروني', payload, is_published:false
  }, { onConflict:'content_key' });
  if (error) { notice('فشل الحفظ: '+error.message,true); return false; }
  notice('تم الحفظ بنجاح على قاعدة البيانات ويمكن فتحه من أي جهاز بعد تسجيل الدخول.');
  return true;
}
function updateStats() {
  $('storeProductCount').textContent = payload.products.length;
  $('storePublishedCount').textContent = payload.products.filter(p=>p.status==='published').length;
  $('storeStockValue').textContent = payload.products.reduce((sum,p)=>sum+Number(p.price||0)*Number(p.stock||0),0).toLocaleString('ar-EG');
  $('storeOrderCount').textContent = payload.orders.length;
}
function renderProducts() {
  const tbody = $('storeProductsRows');
  if (!tbody) return;
  const q = ($('storeSearch')?.value||'').trim().toLowerCase();
  const shown = payload.products.map((p,i)=>({p,i})).filter(({p})=>
    [p.name,p.nameEn,p.sku,p.category].join(' ').toLowerCase().includes(q));
  tbody.innerHTML = shown.map(({p,i})=>'<tr><td>'+(p.images?.[0]?'<img src="'+esc(p.images[0])+'" alt="" style="width:48px;height:58px;object-fit:cover;border-radius:7px">':'')+' '+esc(p.name)+'<small style="display:block;color:#aaa">'+esc(p.nameEn)+'</small></td><td>'+esc(p.sku)+'</td><td>'+esc(p.category)+'</td><td>'+Number(p.price||0).toLocaleString('ar-EG')+' ج.م</td><td>'+esc(p.stock)+'</td><td>'+esc(({published:'منشور',draft:'مسودة',hidden:'مخفي'})[p.status]||p.status)+'</td><td><button class="btn" data-edit="'+i+'">تعديل</button> <button class="btn" data-copy="'+i+'">نسخ</button> <button class="btn" data-delete="'+i+'">حذف</button></td></tr>').join('') || '<tr><td colspan="7">لا توجد منتجات محفوظة.</td></tr>';
  updateStats();
}
function resetForm() { editing=null; fields.forEach(id=>$(id).value=''); $('spStatus').value='draft'; }
function fillForm(p) {
  $('spName').value=p.name||''; $('spNameEn').value=p.nameEn||''; $('spSku').value=p.sku||'';
  $('spCategory').value=p.category||''; $('spPrice').value=p.price??''; $('spOldPrice').value=p.oldPrice??'';
  $('spFabric').value=p.fabric||''; $('spCollection').value=p.collection||''; $('spSizes').value=p.sizes||'';
  $('spColors').value=p.colors||''; $('spStock').value=p.stock??0; $('spImages').value=(p.images||[]).join('\n');
  $('spDesc').value=p.description||''; $('spDescEn').value=p.descriptionEn||'';
  $('spVariants').value=(p.variants||[]).map(v=>[v.color,v.size,v.qty,v.sku].join(' | ')).join('\n');
  $('spSeoTitle').value=p.seoTitle||''; $('spSeo').value=p.seo||''; $('spStatus').value=p.status||'draft';
}
function showForm(p=null,index=null) {
  editing=index; resetForm(); editing=index;
  if (p) fillForm(p);
  $('storeFormCard').style.display='block';
  $('storeFormCard').scrollIntoView({behavior:'smooth',block:'start'});
}
function parseProduct() {
  const name=$('spName').value.trim();
  if (!name) { notice('اكتب اسم المنتج بالعربية أولًا.',true); return null; }
  const variants=$('spVariants').value.split('\n').map(x=>x.trim()).filter(Boolean).map(line=>{
    const a=line.split('|').map(x=>x.trim()); return {color:a[0]||'',size:a[1]||'',qty:Number(a[2]||0),sku:a[3]||''};
  });
  return {
    name,nameEn:$('spNameEn').value.trim(),sku:$('spSku').value.trim(),category:$('spCategory').value.trim(),
    price:Number($('spPrice').value||0),oldPrice:Number($('spOldPrice').value||0),fabric:$('spFabric').value.trim(),
    collection:$('spCollection').value.trim(),sizes:$('spSizes').value.trim(),colors:$('spColors').value.trim(),
    stock:Number($('spStock').value||0),images:$('spImages').value.split('\n').map(x=>x.trim()).filter(Boolean),
    description:$('spDesc').value.trim(),descriptionEn:$('spDescEn').value.trim(),variants,
    seoTitle:$('spSeoTitle').value.trim(),seo:$('spSeo').value.trim(),status:$('spStatus').value
  };
}
function renderJsonTab(tab) {
  currentTab=tab;
  const cfg=tabs[tab], value=payload[cfg.key] ?? (tab==='storefront'?{}:[]);
  $('storePanel').innerHTML='<h3>'+cfg.title+'</h3><p class="dim">'+cfg.hint+'</p><textarea id="storeJsonEditor" rows="18" style="width:100%;font-family:monospace;direction:ltr"></textarea><div style="margin-top:12px"><button class="btn primary" id="storeJsonSave">حفظ البيانات</button><button class="btn" id="storeJsonReset">استعادة المعروض</button></div>';
  $('storeJsonEditor').value=JSON.stringify(value,null,2);
  $('storeJsonSave').onclick=async()=>{
    try { const next=JSON.parse($('storeJsonEditor').value); if (!Array.isArray(next) && (next===null || typeof next!=='object')) throw new Error('اكتب مصفوفة أو كائن JSON.'); payload[cfg.key]=next; if(await persist()) updateStats(); }
    catch(e){ notice('JSON غير صالح: '+e.message,true); }
  };
  $('storeJsonReset').onclick=()=>{$('storeJsonEditor').value=JSON.stringify(payload[cfg.key]??(tab==='storefront'?{}:[]),null,2);};
}
$('storeAddToggle')?.addEventListener('click',()=>showForm());
$('storeCancel')?.addEventListener('click',()=>{$('storeFormCard').style.display='none';});
$('storeSaveProduct')?.addEventListener('click',async()=>{
  const product=parseProduct(); if(!product)return;
  if(editing===null) payload.products.push(product); else payload.products[editing]=product;
  if(await persist()){renderProducts();$('storeFormCard').style.display='none';resetForm();}
});
$('storeSearch')?.addEventListener('input',renderProducts);
$('storePanel')?.addEventListener('click',async event=>{
  const b=event.target.closest('button'); if(!b)return;
  const i=Number(b.dataset.edit??b.dataset.copy??b.dataset.delete);
  if(b.dataset.delete!==undefined){if(confirm('تأكيد حذف المنتج؟')){payload.products.splice(i,1);if(await persist())renderProducts();}}
  else if(b.dataset.copy!==undefined){const copy=structuredClone(payload.products[i]);copy.sku=(copy.sku||'')+'-COPY';copy.name+=' (نسخة)';payload.products.push(copy);if(await persist())renderProducts();}
  else if(b.dataset.edit!==undefined)showForm(payload.products[i],i);
});
document.querySelectorAll('[data-store-tab]').forEach(button=>button.addEventListener('click',()=>{
  const tab=button.dataset.storeTab;
  if(tab==='products'){
    currentTab='products';
    $('storePanel').innerHTML='<h3>قائمة المنتجات</h3><div class="filters"><div><label>بحث</label><input id="storeSearch" placeholder="اسم أو كود المنتج"></div></div><div class="survey-wrap"><table class="survey-table" style="min-width:900px"><thead><tr><th>المنتج</th><th>الكود</th><th>التصنيف</th><th>السعر</th><th>المخزون</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody id="storeProductsRows"></tbody></table></div>';
    $('storeSearch').addEventListener('input',renderProducts);renderProducts();
  } else renderJsonTab(tab);
}));
loadStore().catch(error=>console.error('LUX WEAR store module:',error));
