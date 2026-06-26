const mvpModules = ['Clientes', 'Propiedades', 'Trabajos', 'Planificacion', 'Reportes'];

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10 text-slate-950">
      <section className="mx-auto flex max-w-5xl flex-col gap-10">
        <div className="flex flex-col gap-4 border-b border-emerald-900/15 pb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">CleanOps</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Base operativa para empresas de limpieza.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-700">
            Esta fase prepara la arquitectura tecnica del MVP sin integrar bexio, autenticacion, IA
            ni Google Calendar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {mvpModules.map((moduleName) => (
            <div
              key={moduleName}
              className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-600">Modulo MVP</p>
              <h2 className="mt-2 text-lg font-semibold">{moduleName}</h2>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
