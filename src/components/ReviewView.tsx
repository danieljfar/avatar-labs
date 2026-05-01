'use client';

import { useState } from 'react';
import { updateContentStatus } from '@/app/actions';
import { ContentPiece } from '@/types/content';
import { Check, X, Send } from 'lucide-react';
import { getEmbedUrl } from '@/lib/video';

export default function ReviewView({ piece }: { piece: ContentPiece }) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    await updateContentStatus(piece.id, 'Approved');
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!showFeedback) {
      setShowFeedback(true);
      return;
    }
    setIsSubmitting(true);
    await updateContentStatus(piece.id, 'Rejected', feedback);
    setIsSubmitting(false);
  };

  const embedUrl = getEmbedUrl(piece.video_url);
  const isDirectVideo = !embedUrl.includes('youtube') && !embedUrl.includes('vimeo');

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{piece.title}</h1>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
            piece.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
            piece.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
            'bg-rose-100 text-rose-700'
          }`}>
            {piece.status}
          </span>
        </div>
      </div>

      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-8">
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

      {piece.status === 'Pending' && (
        <div className="space-y-6">
          {!showFeedback ? (
            <div className="flex gap-4">
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Check className="w-6 h-6" /> Approve Video
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex-1 bg-rose-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" /> Reject with Feedback
              </button>
            </div>
          ) : (
            <div className="bg-card border rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
              <label className="block text-lg font-semibold mb-3">What needs to be changed?</label>
              <textarea
                autoFocus
                className="w-full bg-background border rounded-lg p-4 min-h-[120px] focus:ring-2 focus:ring-primary/20 outline-none transition-all mb-4"
                placeholder="e.g. Please adjust the lighting in the final shot..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  disabled={isSubmitting || !feedback.trim()}
                  className="flex-1 bg-rose-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" /> Submit Rejection
                </button>
                <button
                  onClick={() => setShowFeedback(false)}
                  className="px-6 bg-muted text-muted-foreground py-3 rounded-lg font-bold hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {(piece.status === 'Approved' || piece.status === 'Rejected') && (
        <div className="bg-muted/50 border rounded-xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-background shadow-sm border">
            {piece.status === 'Approved' ? (
              <Check className="w-8 h-8 text-emerald-500" />
            ) : (
              <X className="w-8 h-8 text-rose-500" />
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            This piece has been {piece.status.toLowerCase()}
          </h2>
          {piece.feedback && (
            <p className="text-muted-foreground mt-4 italic max-w-md mx-auto">
              "{piece.feedback}"
            </p>
          )}
        </div>
      )}
    </div>
  );
}
