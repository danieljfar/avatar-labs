'use client';

import { useState } from 'react';
import { createContentPiece } from '@/app/actions';
import { Plus, Loader2 } from 'lucide-react';
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
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" /> New Content
      </h2>
      <form action={handleSubmit} className="space-y-4">
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
          disabled={isSubmitting}
          className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating...
            </>
          ) : (
            'Create Review Link'
          )}
        </button>
      </form>
    </div>
  );
}
