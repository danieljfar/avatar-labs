import { supabase } from '@/lib/supabase';
import ReviewView from '@/components/ReviewView';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const { data: piece, error } = await supabase
    .from('content_pieces')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !piece) {
    notFound();
  }

  return <ReviewView piece={piece} />;
}
