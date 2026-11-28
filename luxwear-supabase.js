import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

export const supabase = createClient(
  'https://hxyxwvpipnlxjyyoptyb.supabase.co',
  'sb_publishable__jpC6S1gt3PYgGa-CLn_FA_1WdtqakK'
);

export async function requireLuxAdmin() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    location.replace('admin-login.html');
    return null;
  }
  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', session.user.id)
    .maybeSingle();
  if (adminError || !admin) {
    await supabase.auth.signOut();
    location.replace('admin-login.html?access=denied');
    return null;
  }
  return session;
}
