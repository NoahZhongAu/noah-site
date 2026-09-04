import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col justify-center gap-6 px-gutter">
      <p className="text-mono-label text-fg-62">404</p>
      <h1 className="text-section">Page not found</h1>
      <p>
        <Link href="/" className="text-mono-tight underline underline-offset-4">
          Back to the start
        </Link>
      </p>
    </section>
  );
}
