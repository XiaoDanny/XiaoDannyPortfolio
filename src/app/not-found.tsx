import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 text-white">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.28em] text-gray-500">404</p>
        <h1 className="mt-4 text-3xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-gray-400">
          The page you’re looking for doesn’t exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md border border-strong px-5 py-2 text-sm uppercase tracking-[0.22em] text-white transition-colors hover:bg-white hover:text-black"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
