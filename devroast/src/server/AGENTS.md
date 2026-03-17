# tRPC Server - Padrões e Convenções

## Visão Geral

Este documento define os padrões para a implementação de APIs usando tRPC v11 no projeto DevRoast.

## Estrutura de Arquivos

```
src/server/
├── context.ts       # Definição do contexto da aplicação
├── trpc.ts          # Configuração base do tRPC
├── index.ts         # Exporta o AppRouter
└── routers/         # Routers da aplicação
    ├── _app.ts      # Router principal (appRouter)
    └── stats.ts     # Router de estatísticas
```

## Configuração Base

### trpc.ts

Arquivo de configuração base que inicializa o tRPC:

```typescript
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
```

### context.ts

Definição do contexto da aplicação:

```typescript
import { db } from "@/db";

export async function createContext() {
  return { db };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

## Routers

### Estrutura de um Router

Cada router deve ser um arquivo separado em `src/server/routers/`:

```typescript
import { isNotNull, sql } from "drizzle-orm";
import { analyses, submissions } from "@/db/schema";
import { publicProcedure, router } from "../trpc";

export const statsRouter = router({
  getMetrics: publicProcedure.query(async ({ ctx }) => {
    const totalSubmissions = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(submissions);

    return {
      totalSubmissions: totalSubmissions[0]?.count ?? 0,
    };
  }),
});
```

### Router Principal (_app.ts)

O router principal combina todos os routers:

```typescript
import { router } from "../trpc";
import { statsRouter } from "./stats";

export const appRouter = router({
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
```

### Server Entry (index.ts)

Exporta o AppRouter para uso do cliente:

```typescript
export { appRouter } from "./routers/_app";
export type { AppRouter } from "./routers/_app";
export { createContext } from "./context";
```

## Procedures

### publicProcedure

Use `publicProcedure` para rotas públicas (sem autenticação):

```typescript
export const myRouter = router({
  getData: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(myTable);
  }),
  
  createData: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(myTable).values(input);
    }),
});
```

## API Route (Next.js App Router)

O handler da API deve estar em `src/app/api/trpc/[trpc]/route.ts`:

```typescript
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server";
import { createContext } from "@/server/context";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
    onError({ error, path }) {
      if (error.code === "INTERNAL_SERVER_ERROR" && path) {
        console.error(`[tRPC error] em "${path}":`, error);
      }
    },
  });

export { handler as GET, handler as POST };
```

## Convenções de Nomenclatura

- **命名**: Nome do arquivo em kebab-case (ex: `stats.ts`, `user-profile.ts`)
- **命名**: Nome do router em camelCase (ex: `statsRouter`, `userProfileRouter`)
- **命名**: Nome dos procedures em camelCase (ex: `getMetrics`, `createSubmission`)

## Regras

1. **Nunca use `export default`** - use named exports
2. **Um router por arquivo** - mantenha os routers separados
3. **Use Zod para validação** - defina schemas de input com Zod
4. **Context disponível em todas procedures** - `ctx.db` para acesso ao banco
5. **Superjson para serialização** - já configurado no transformer

## Referências

- [tRPC v11 Docs](https://trpc.io)
- [Superjson](https://github.com/blitz-js/superjson)
