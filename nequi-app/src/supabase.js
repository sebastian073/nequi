import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ssnuytykqgipbaqxutgh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzbnV5dHlrcWdpcGJhcXh1dGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODA1MjQsImV4cCI6MjA2Mzg1NjUyNH0.bsAnvitZYACUC7pZFaBSywDZxmEBmjkb-Xg8V6edSGo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
