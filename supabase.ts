import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qoponkdyllxxqbakwiwf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcG9ua2R5bGx4eHFiYWt3aXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NDc4MzEsImV4cCI6MjA1MTIyMzgzMX0.Bf0cQ0PGm9FZ_Ryd8O8GeS4i0ZYCaZk6XRZjxULLdKQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})