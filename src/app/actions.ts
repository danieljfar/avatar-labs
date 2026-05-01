'use server';

import { supabase } from '@/lib/supabase';
import { ContentStatus } from '@/types/content';
import { revalidatePath } from 'next/cache';

export async function createContentPiece(formData: FormData) {
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
  const { error } = await supabase
    .from('content_pieces')
    .update({ status, feedback: feedback || null })
    .eq('id', id);

  if (error) {
    console.error('Error updating content status:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/review/${id}`);
  return { success: true };
}
