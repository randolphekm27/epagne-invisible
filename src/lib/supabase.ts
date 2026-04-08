import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://wbfywaonscqipumjcefq.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xdxAaDzUAaxH-3Drs9338Q_jk167eFO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
