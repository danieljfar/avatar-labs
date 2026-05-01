'use client';

import { useState } from 'react';
import { updateContentStatus } from '@/app/actions';
import { ContentPiece, ContentStatus } from '@/types/content';
import { Check, X, Send, Loader2, ChevronLeft, Calendar, Play } from 'lucide-react';
import { getEmbedUrl } from '@/lib/video';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReviewView({ piece }: { piece: ContentPiece }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Local state for immediate UI feedback
  const [currentStatus, setCurrentStatus] = useState<ContentStatus>(piece.status);
  const [currentFeedback, setCurrentFeedback] = useState<string | null>(piece.feedback);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const result = await updateContentStatus(piece.id, 'Approved');
      if (result?.success) {
        setCurrentStatus('Approved');
        router.refresh();
      } else {
        alert(`Failed to approve: ${result?.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('A network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!showFeedback) {
      setShowFeedback(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await updateContentStatus(piece.id, 'Rejected', feedback);
      if (result?.success) {
        setCurrentStatus('Rejected');
        setCurrentFeedback(feedback);
        setShowFeedback(false);
        router.refresh();
      } else {
        alert(`Failed to reject: ${result?.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('A network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const embedUrl = getEmbedUrl(piece.video_url);
  const isDirectVideo = !embedUrl.includes('youtube') && !embedUrl.includes('vimeo');

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              currentStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
              currentStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
              'bg-rose-100 text-rose-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                currentStatus === 'Pending' ? 'bg-amber-500' :
                currentStatus === 'Approved' ? 'bg-emerald-500' :
                'bg-rose-500'
              }`} />
              {currentStatus}
            </span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 mt-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{piece.title}</h1>
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(piece.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
            <div className="flex items-center gap-1.5">
              <Play className="w-4 h-4" />
              {isDirectVideo ? 'Direct Video' : 'Embed Player'}
            </div>
          </div>
        </div>

        <div className="relative group rounded-2xl overflow-hidden bg-black aspect-video shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] mb-12">
          {isDirectVideo ? (
            <video src={embedUrl} controls className="w-full h-full" />
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {currentStatus === 'Pending' && (
          <div className="max-w-2xl mx-auto">
            {!showFeedback ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="h-16 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                  Approve Video
                </button>
                <button
                  onClick={handleReject}
                  disabled={isLoading}
                  className="h-16 bg-white text-rose-600 border-2 border-rose-100 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                  Request Changes
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Feedback</h3>
                <p className="text-slate-500 text-sm mb-6">Describe the changes you'd like to see in the next version.</p>
                <textarea
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 min-h-[160px] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all mb-6 text-slate-700 placeholder:text-slate-400"
                  placeholder="e.g. The music transition at 0:45 feels too abrupt..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleReject}
                    disabled={isLoading || !feedback.trim()}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    Submit Feedback
                  </button>
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="px-8 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {(currentStatus === 'Approved' || currentStatus === 'Rejected') && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-[32px] p-12 text-center shadow-sm">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              currentStatus === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}>
              {currentStatus === 'Approved' ? (
                <Check className="w-10 h-10" />
              ) : (
                <X className="w-10 h-10" />
              )}
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">
              Content {currentStatus}
            </h2>
            <p className="text-slate-500 mb-8 font-medium">
              This review is now closed.
            </p>
            {currentFeedback && (
              <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Client Feedback</span>
                <p className="text-slate-700 italic leading-relaxed">
                  "{currentFeedback}"
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
