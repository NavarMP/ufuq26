import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-mesh-pattern">
      <div className="p-8 rounded-3xl glass-panel border border-brand-gold/30 shadow-2xl max-w-md space-y-4">
        <h1 className="font-clash text-6xl font-extrabold text-brand-gold">404</h1>
        <h2 className="font-clash text-xl font-bold text-brand-navy dark:text-white">
          Page Not Found
        </h2>
        <p className="text-xs text-neutral-500">
          The requested page could not be located.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-gold text-brand-navy font-clash font-bold text-xs shadow-md hover:bg-brand-gold-hover transition-colors"
        >
          Return to UFUQ ’26
        </Link>
      </div>
    </div>
  );
}
