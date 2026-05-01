import { supabase } from '@/lib/supabase';
import ReviewView from '@/components/ReviewView';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: piece, error } = await supabase
    .from('content_pieces')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !piece) {
    notFound();
  }

  return <ReviewView piece={piece} />;
}
