import { supabase } from './supabaseClient';

export async function listExamples() {
  if (!supabase) return { error: 'No Supabase client configured' };
  return supabase.from('matrix_examples').select('*').order('created_at', { ascending: false });
}

export async function saveExample({ name, type, matrix }) {
  if (!supabase) return { error: 'No Supabase client configured' };
  return supabase.from('matrix_examples').insert([{ name, type, matrix, created_at: new Date().toISOString() }]).select();
}

export async function getExample(id) {
  if (!supabase) return { error: 'No Supabase client configured' };
  return supabase.from('matrix_examples').select('*').eq('id', id).single();
}

export async function deleteExample(id) {
  if (!supabase) return { error: 'No Supabase client configured' };
  return supabase.from('matrix_examples').delete().eq('id', id);
}
