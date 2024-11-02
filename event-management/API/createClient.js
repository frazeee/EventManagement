import { createClient } from '@supabase/supabase-js';

//  console.log(process.env.VITE_SUPABASE_KEY);
console.log(import.meta.env.VITE_SUPABASE_KEY);

const supabaseUrl = 'https://anzspqpmocdptqesqzzs.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey)