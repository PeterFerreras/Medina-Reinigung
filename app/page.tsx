export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">CleanOps</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
        Base técnica para operaciones de limpieza.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
        Proyecto inicial con Next.js, TypeScript estricto, Tailwind CSS, Prisma, PostgreSQL, Vitest
        y Playwright.
      </p>
    </main>
  );
}
