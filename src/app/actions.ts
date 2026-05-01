'use server';

import { createClient } from '@supabase/supabase-js';
import { ContentStatus } from '@/types/content';
import { revalidatePath } from 'next/cache';
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(url, key);
}

export async function createContentPiece(formData: FormData) {
  const supabase = getSupabase();
  const title = formData.get('title') as string;
  const video_url = formData.get('video_url') as string;

  const { data, error } = await supabase
    .from('content_pieces')
    .insert([{ title, video_url, status: 'Pending' }])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating content piece:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { id: data.id };
}

export async function updateContentStatus(
  id: string,
  status: ContentStatus,
  feedback?: string
) {
  console.log(`Attempting to update ${id} to ${status}`);
  const supabase = getSupabase();
  
  try {
    const { error } = await supabase
      .from('content_pieces')
      .update({ 
        status: status, 
        feedback: feedback || null 
      })
      .eq('id', id);

    if (error) {
      console.error('Supabase update error:', error);
      return { error: error.message };
    }

    revalidatePath('/dashboard');
    revalidatePath(`/review/${id}`);
    return { success: true };
  } catch (e) {
    console.error('Action exception:', e);
    return { error: 'Internal server error' };
  }
}
