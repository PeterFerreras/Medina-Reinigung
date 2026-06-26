# CleanOps

CleanOps será una plataforma operativa para empresas de limpieza. Esta primera fase crea únicamente la base técnica del proyecto, sin integrar todavía bexio, autenticación, IA ni Google Calendar.

## Objetivo del proyecto

Centralizar los procesos clave de una empresa de limpieza: gestión de clientes, planificación de trabajos, seguimiento operativo, documentación y preparación para futuras integraciones externas.

## Módulos del MVP

- **Clientes y ubicaciones:** registro de clientes, direcciones y datos operativos.
- **Servicios de limpieza:** catálogo de servicios, frecuencias y requisitos.
- **Planificación operativa:** asignación de trabajos, equipos y calendarios internos.
- **Control de ejecución:** estados de tareas, evidencias y observaciones.
- **Facturación preparada para integración:** estructura futura para conectar con bexio, sin implementación en esta fase.

## Stack técnico

- Next.js con App Router
- TypeScript en modo estricto
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Vitest para pruebas unitarias y de integración ligera
- Playwright para pruebas end-to-end
- ESLint y Prettier para calidad y formato

## Comandos de desarrollo

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Comandos de pruebas y calidad

```bash
npm run lint
npm run format:check
npm run test
npm run test:e2e
```

Para ejecutar Playwright por primera vez puede ser necesario instalar los navegadores:

```bash
npx playwright install
```

## Arquitectura de carpetas

```text
app/          Rutas, layouts, páginas y estilos globales de Next.js.
components/   Componentes reutilizables de interfaz.
domain/       Modelos, reglas de negocio y tipos del dominio.
lib/          Clientes técnicos, adaptadores compartidos y utilidades base.
services/     Casos de uso y coordinación entre dominio e infraestructura.
prisma/       Esquema Prisma, migraciones y configuración de base de datos.
tests/        Pruebas unitarias, integración ligera y end-to-end.
```

## Alcance excluido en esta fase

- Integración con bexio
- Autenticación y autorización
- Funcionalidades de IA
- Integración con Google Calendar
