import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24 text-center bg-gradient-to-b from-background to-muted/50">
      <h1 className="text-5xl font-extrabold tracking-tight mb-6">
        Fleepr <span className="text-primary italic">Trial</span>
      </h1>
      <p className="text-xl text-muted-foreground mb-12 max-w-lg">
        The fastest way for agencies to get content approvals. 
        Minimal, modern, and built for speed.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/dashboard" 
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-lg hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
