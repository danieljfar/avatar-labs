'use client';

import { useState } from 'react';
import { createContentPiece } from '@/app/actions';
import { Plus, Loader2, Type, Link as LinkIcon, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    const result = await createContentPiece(formData);
    
    if (result?.id) {
      router.push(`/review/${result.id}`);
    } else {
      setIsSubmitting(false);
      if (result?.error) alert(`Error: ${result.error}`);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles className="w-12 h-12 text-indigo-600" />
      </div>
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
          <Plus className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">New Piece</h2>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="title">
            Project Title
          </label>
          <div className="relative group/input">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
              <Type className="w-4 h-4" />
            </div>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Summer Campaign V1"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1" htmlFor="video_url">
            Video Destination
          </label>
          <div className="relative group/input">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              id="video_url"
              name="video_url"
              type="url"
              required
              placeholder="YouTube, Vimeo, or direct link"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> 
              <span>Generating Link...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Create Review Link</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
