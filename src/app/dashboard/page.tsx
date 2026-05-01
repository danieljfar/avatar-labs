import { ContentPiece } from '@/types/content';
import { supabase } from '@/lib/supabase';
import CreateForm from '@/components/CreateForm';
import Link from 'next/link';
import { ExternalLink, Clock, CheckCircle, XCircle, LayoutDashboard, Film } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const { data: pieces, error } = await supabase
    .from('content_pieces')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-3xl border border-rose-100 shadow-xl text-center">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error loading dashboard</h2>
          <p className="text-slate-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 italic">Fleepr</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Agency</p>
              <p className="text-sm font-bold text-slate-900">Content Studio v1</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <section className="lg:col-span-4">
            <div className="sticky top-32">
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">Dashboard</h1>
                <p className="text-slate-500 font-medium">Create and manage content approval links for your clients.</p>
              </div>
              <CreateForm />
            </div>
          </section>

          <section className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border shadow-sm">
                  <Film className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Recent Content</h2>
              </div>
              <span className="px-4 py-1.5 bg-white border rounded-full text-xs font-bold text-slate-500 shadow-sm">
                {pieces?.length || 0} Pieces Total
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pieces?.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-20 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Film className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No content yet</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">Upload your first piece of content to start the approval process.</p>
                </div>
              ) : (
                pieces?.map((piece: ContentPiece) => (
                  <div key={piece.id} className="group bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-between hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <Film className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-indigo-600 transition-colors">{piece.title}</h3>
                        <div className="flex items-center gap-4 mt-1.5 text-sm font-medium">
                          <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            piece.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                            piece.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                            'bg-rose-50 text-rose-600'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              piece.status === 'Pending' ? 'bg-amber-500' :
                              piece.status === 'Approved' ? 'bg-emerald-500' :
                              'bg-rose-500'
                            }`} />
                            {piece.status}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(piece.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/review/${piece.id}`}
                      className="ml-6 p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
