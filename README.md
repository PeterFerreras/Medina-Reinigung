# CleanOps

CleanOps es una aplicacion de operaciones para empresas de limpieza. El objetivo del MVP es centralizar clientes, propiedades, trabajos, planificacion operativa y reportes basicos en una base tecnica mantenible.

## Modulos del MVP

- Clientes y contactos.
- Propiedades y ubicaciones de servicio.
- Trabajos, tareas y estados operativos.
- Planificacion interna.
- Reportes basicos de actividad.

Esta fase no incluye integracion con bexio, autenticacion, IA ni Google Calendar.

## Comandos de desarrollo

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

La aplicacion queda disponible en `http://localhost:3000`.

## Comandos de pruebas y calidad

```bash
npm run format:check
npm run lint
npm run test
npm run test:e2e
```

## Arquitectura de carpetas

- `app/`: rutas, layouts y estilos globales de Next.js.
- `components/`: componentes reutilizables de interfaz.
- `domain/`: modelos, reglas y tipos del dominio.
- `lib/`: clientes e infraestructura compartida.
- `services/`: casos de uso y servicios de aplicacion.
- `prisma/`: esquema Prisma y futuras migraciones.
- `tests/`: pruebas unitarias, integracion y end-to-end.
