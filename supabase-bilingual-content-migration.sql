-- LUX WEAR bilingual content extension (Arabic + English)
-- Safe to run after supabase-website-schema.sql. Existing Arabic content remains unchanged.

-- Store hours: bilingual day names.
ALTER TABLE public.store_hours ADD COLUMN IF NOT EXISTS day_name_en text;
UPDATE public.store_hours SET
  day_name_ar = COALESCE(day_name_ar, CASE day_of_week
    WHEN 0 THEN 'الأحد' WHEN 1 THEN 'الإثنين' WHEN 2 THEN 'الثلاثاء'
    WHEN 3 THEN 'الأربعاء' WHEN 4 THEN 'الخميس' WHEN 5 THEN 'الجمعة'
    WHEN 6 THEN 'السبت' END),
  day_name_en = COALESCE(day_name_en, CASE day_of_week
    WHEN 0 THEN 'Sunday' WHEN 1 THEN 'Monday' WHEN 2 THEN 'Tuesday'
    WHEN 3 THEN 'Wednesday' WHEN 4 THEN 'Thursday' WHEN 5 THEN 'Friday'
    WHEN 6 THEN 'Saturday' END);
ALTER TABLE public.store_hours ALTER COLUMN day_name_ar SET NOT NULL;
ALTER TABLE public.store_hours ALTER COLUMN day_name_en SET NOT NULL;

-- Care guides: preserve current Arabic fields and add independent English fields.
ALTER TABLE public.care_guides ADD COLUMN IF NOT EXISTS product_name_en text NOT NULL DEFAULT '';
ALTER TABLE public.care_guides ADD COLUMN IF NOT EXISTS material_en text NOT NULL DEFAULT '';
ALTER TABLE public.care_guides ADD COLUMN IF NOT EXISTS washing_instructions_en text NOT NULL DEFAULT '';
ALTER TABLE public.care_guides ADD COLUMN IF NOT EXISTS drying_instructions_en text NOT NULL DEFAULT '';
ALTER TABLE public.care_guides ADD COLUMN IF NOT EXISTS ironing_instructions_en text NOT NULL DEFAULT '';
ALTER TABLE public.care_guides ADD COLUMN IF NOT EXISTS warnings_en text NOT NULL DEFAULT '';

-- luxwear_content.payload remains JSONB to allow separate 'ar' and 'en' content
-- without overwriting either language; admin/editor code must use that structure.
-- Customer reviews keep the submitted language and answers JSON payload.
