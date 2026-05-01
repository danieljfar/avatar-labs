import { ContentPiece } from '@/types/content';
import { supabase } from '@/lib/supabase';
import { createContentPiece } from '@/app/actions';
import Link from 'next/link';
import { Plus, ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';

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
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" /> New Content
            </h2>
            <form action={createContentPiece} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Summer Campaign V1"
                  className="w-full px-3 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" htmlFor="video_url">Video URL</label>
                <input
                  id="video_url"
                  name="video_url"
                  type="url"
                  required
                  placeholder="YouTube, Vimeo, or direct link"
                  className="w-full px-3 py-2 bg-background border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Create Review Link
              </button>
            </form>
          </div>
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
