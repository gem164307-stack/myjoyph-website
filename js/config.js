// This file belongs only to this new standalone MyJoyPH website.
// The Supabase publishable/anon key is safe for browser use when RLS is configured.
// Never put a service_role key or other secret in frontend code.
window.MYJOYPH = {
  SUPABASE_URL: "https://wfuokohhwnvoeibumhdw.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_VG9Lmf3pOiceV53rJfKykA_YJDJLvuo",
  STORAGE_BUCKET: "myjoyph-menu-photos",
  BUSINESS_ADDRESS: "3rd level, ayala center cebu, Cebu City, 6000 Cebu",
  FACEBOOK_URL: "https://www.facebook.com/MyJoyPH",
  CURRENCY: "PHP"
};
window.myjoyDb = window.supabase?.createClient(
  window.MYJOYPH.SUPABASE_URL,
  window.MYJOYPH.SUPABASE_ANON_KEY,
  { auth: { persistSession: true, autoRefreshToken: true } }
);