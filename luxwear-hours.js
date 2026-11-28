import { supabase } from './luxwear-supabase.js';
(async()=>{
 try{
  const {data,error}=await supabase.from('store_hours').select('day_of_week,is_closed,open_time,close_time').order('day_of_week');
  if(error) throw error;
  const schedule=window.luxWeeklyHours;
  (data||[]).forEach(row=>{
   const day=Number(row.day_of_week);
   const toMinutes=value=>{if(!value)return 0;const [h,m]=String(value).split(':').map(Number);return h*60+m};
   schedule[day]=row.is_closed?{open:0,close:0,closed:true}:{open:toMinutes(row.open_time),close:toMinutes(row.close_time),closed:false};
  });
  document.querySelectorAll('.day').forEach(card=>{
   const d=Number(card.dataset.day),h=schedule[d];if(!h)return;
   card.querySelector('.time').textContent=h.closed?(document.documentElement.lang==='en'?'Closed':'مغلق'):`${String(Math.floor(h.open/60)%12||12)}:${String(h.open%60).padStart(2,'0')} – ${String(Math.floor(h.close/60)%12||12)}:${String(h.close%60).padStart(2,'0')}`;
  });
  if(window.luxUpdateHoursStatus)window.luxUpdateHoursStatus();
 }catch(error){console.warn('LUX WEAR business hours database unavailable; showing built-in schedule.',error)}
})();