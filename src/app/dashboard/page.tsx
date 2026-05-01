import { ContentPiece } from '@/types/content';
import { supabase } from '@/lib/supabase';
import CreateForm from '@/components/CreateForm';
import Link from 'next/link';
import { ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const { data: pieces, error } = await supabase
    .from('content_pieces')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Error loading dashboard: {error.message}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agency Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and track content approvals</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1">
          <CreateForm />
        </section>

        <section className="lg:col-span-2">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Active Pieces</h2>
            </div>
            <div className="divide-y">
              {pieces?.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  No content pieces yet. Create one to get started.
                </div>
              ) : (
                pieces?.map((piece: ContentPiece) => (
                  <div key={piece.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="font-semibold text-lg truncate">{piece.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          {piece.status === 'Pending' && <Clock className="w-4 h-4 text-amber-500" />}
                          {piece.status === 'Approved' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                          {piece.status === 'Rejected' && <XCircle className="w-4 h-4 text-rose-500" />}
                          {piece.status}
                        </span>
                        <span>{new Date(piece.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/review/${piece.id}`}
                        className="p-2 hover:bg-muted rounded-lg transition-colors border shadow-sm flex items-center gap-2 px-4"
                      >
                        <span className="text-sm font-medium">Review Page</span>
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
