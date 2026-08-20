import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidConfig = supabaseUrl && 
                      supabaseAnonKey && 
                      supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL' && 
                      supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

export const supabase = isValidConfig ? createClient(supabaseUrl, supabaseAnonKey) : null;
