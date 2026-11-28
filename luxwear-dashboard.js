import { supabase, requireLuxAdmin } from './luxwear-supabase.js';

const session = await requireLuxAdmin();
if (session) {
  const logout = document.getElementById('logoutBtn');
  logout?.addEventListener('click', async (event) => {
    event.preventDefault();
    if (!confirm('هل تريد تسجيل الخروج؟')) return;
    await supabase.auth.signOut();
    location.replace('admin-login.html');
  }, true);

  const surveySection = document.getElementById('surveys');
  const table = surveySection?.querySelector('.survey-table tbody');
  const notice = surveySection?.querySelector('.notice');
  const detail = document.getElementById('surveyDetail');
  const search = document.getElementById('surveySearch');
  const from = document.getElementById('surveyFrom');
  const to = document.getElementById('surveyTo');
  const filter = document.getElementById('surveyFilter');
  let records = [];
  let selected = null;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[ch]);
  const questions = [
    'كيف تقيّم تجربتك بشكل عام مع LUX WEAR؟',
    'كيف قمت بالشراء من LUX WEAR؟',
    'كيف تعرّفت على LUX WEAR لأول مرة؟',
    'ما مدى رضاك عن جودة المنتجات والخامات؟',
    'كيف ترى أسعار منتجاتنا مقارنة بجودتها؟',
    'كيف تقيّم مستوى الخدمة والتعامل داخل المتجر؟',
    'هل وجدت لدينا التنوع والموديلات التي تبحث عنها؟',
    'من وجهة نظرك، ما الجانب الذي تتمنى أن نعمل على تطويره؟',
    'ما المنتجات أو الموديلات التي تتمنى أن نوفرها لك مستقبلاً؟',
    'هل لديك أي ملاحظات أو أفكار أخرى تود مشاركتنا بها؟',
    'ما مدى احتمالية ترشيحك LUX WEAR لأصدقائك ومعارفك؟'
  ];
  const answerAt = (answers, index) => {
    if (Array.isArray(answers)) return answers[index] ?? '';
    if (answers && typeof answers === 'object') return answers['q'+(index+1)] ?? answers[index] ?? '';
    return '';
  };
  const dateParts = value => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return ['—','—','—'];
    return [
      new Intl.DateTimeFormat('ar-EG',{weekday:'long'}).format(date),
      new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'2-digit',year:'numeric'}).format(date),
      new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit'}).format(date)
    ];
  };
  function renderDetail(record) {
    if (!detail) return;
    const answers = record.answers || {};
    detail.querySelector('.rows').innerHTML = questions.map((question,index) =>
      '<div class="rowline"><span>'+esc(question)+'</span><strong>'+esc(answerAt(answers,index) || '—')+'</strong></div>'
    ).join('');
    detail.classList.add('open');
  }
  function render() {
    if (!table) return;
    const q = (search?.value || '').trim().toLowerCase();
    const start = from?.value ? new Date(from.value+'T00:00:00') : null;
    const end = to?.value ? new Date(to.value+'T23:59:59') : null;
    const shown = records.filter(record => {
      const matchesText = !q || (record.customer_name+' '+record.phone).toLowerCase().includes(q);
      const date = new Date(record.created_at);
      return matchesText && (!start || date >= start) && (!end || date <= end);
    });
    table.innerHTML = shown.length ? shown.map(record => {
      const [day,date,time] = dateParts(record.created_at);
      return '<tr><td>'+esc(day)+'</td><td>'+esc(date)+'</td><td>'+esc(time)+'</td><td>'+esc(record.customer_name)+'</td><td>'+esc(record.phone)+'</td>'+
        questions.map((_,i)=>'<td>'+esc(answerAt(record.answers,i) || '—')+'</td>').join('')+
        '<td>'+esc(record.status||'pending')+'</td><td><button class="btn" type="button" data-review-id="'+esc(record.id)+'">عرض</button> '+
        (record.status==='approved'?'': '<button class="btn" type="button" data-status="approved" data-review-id="'+esc(record.id)+'">اعتماد</button> ')+
        (record.status==='rejected'?'': '<button class="btn" type="button" data-status="rejected" data-review-id="'+esc(record.id)+'">رفض</button>')+'</td></tr>';
    }).join('') : '<tr><td colspan="18">لا توجد تقييمات مطابقة.</td></tr>';
    table.querySelectorAll('[data-review-id]').forEach(button => button.addEventListener('click', async () => {
      const record = records.find(item => item.id === button.dataset.reviewId);
      if (!record) return;
      if (!button.dataset.status) { selected = record; renderDetail(selected); return; }
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('customer_reviews').update({
        status: button.dataset.status, reviewed_at: new Date().toISOString(), reviewed_by: user.id
      }).eq('id', record.id);
      if (error) { if (notice) notice.textContent = 'تعذر تحديث حالة التقييم: '+error.message; return; }
      record.status = button.dataset.status;
      record.reviewed_at = new Date().toISOString();
      record.reviewed_by = user.id;
      if (notice) notice.textContent = record.status === 'approved' ? 'تم اعتماد التقييم.' : 'تم رفض التقييم.';
      render();
    }));
  }
  async function loadReviews() {
    if (notice) notice.textContent = 'جارٍ تحميل التقييمات من قاعدة البيانات...';
    const { data, error } = await supabase.from('customer_reviews')
      .select('id, customer_name, phone, language, answers, status, created_at, reviewed_at, reviewed_by')
      .order('created_at', { ascending: false });
    if (error) {
      if (notice) notice.textContent = 'تعذر تحميل التقييمات. راجع صلاحيات القراءة وسياسات RLS لجدول customer_reviews.';
      console.error('LUX WEAR customer_reviews:', error);
      return;
    }
    records = data || [];
    if (notice) notice.textContent = 'تم تحميل '+records.length+' تقييم من قاعدة البيانات.';
    render();
  }
  filter?.addEventListener('click', render);
  search?.addEventListener('input', render);
  loadReviews();

  // Keep authenticated admin session alive across page reloads.
  supabase.auth.onAuthStateChange((event, nextSession) => {
    if (event === 'SIGNED_OUT' || !nextSession) location.replace('admin-login.html');
  });
}
