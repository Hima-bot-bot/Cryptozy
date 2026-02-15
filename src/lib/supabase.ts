import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovypgcqkypgqglwmdkar.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92eXBnY3FreXBncWdsd21ka2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDU1MjIsImV4cCI6MjA4NjcyMTUyMn0.PqLHamoWFiYHu2XcZECXTIncRwTRMXXJSm2ef8F8K6A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
