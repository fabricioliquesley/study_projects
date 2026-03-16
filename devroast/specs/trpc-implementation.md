# Especificação: tRPC API Layer

## Visão Geral

Implementar tRPC v11 como camada de API typesafe para o projeto DevRoast, integrando com Next.js App Router e Server Components. O fluxo é anônimo: o usuário envia um trecho de código e recebe uma análise, sem necessidade de login.

## Stack

- **tRPC**: v11
- **TanStack Query**: v5
- **Next.js**: App Router
- **Banco**: Drizzle ORM (já configurado)
- **Validação**: Zod
- **Serialização**: superjson

---

## Arquitetura

```
src/
├── app/api/trpc/[trpc]/route.ts   # Route handler
├── server/
│   ├── index.ts                   # AppRouter export
│   ├── trpc.ts                    # Inicialização do tRPC (router, publicProcedure)
│   ├── context.ts                 # Contexto tRPC
│   └── routers/
│       ├── _app.ts                # Root router
│       ├── submissions.ts         # Router de submissões
│       ├── analyses.ts            # Router de análises
│       └── leaderboard.ts         # Router de leaderboard
└── trpc/
    ├── react.tsx                  # Client provider + hooks
    ├── server.ts                  # Server utilities
    ├── query-client.ts            # Factory do QueryClient compartilhado
    └── index.ts                   # Re-exports
```

---

## Instalação

```bash
pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod superjson
```

---

## Route Handler

```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '~/server';
import { createContext } from '~/server/context';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
    onError({ error, path }) {
      if (error.code === 'INTERNAL_SERVER_ERROR') {
        // Substitua por seu logger de produção (ex: Sentry, Axiom)
        console.error(`[tRPC error] em "${path}":`, error);
      }
    },
  });

export { handler as GET, handler as POST };
```

---

## Contexto

```typescript
// server/context.ts
import { db } from '~/db';

export async function createContext() {
  return { db };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

> Sem autenticação: o contexto expõe apenas o banco de dados. Caso autenticação seja adicionada futuramente, este é o local para incluir a sessão.

---

## Inicialização do tRPC

```typescript
// server/trpc.ts
import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { type Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
```

> O transformer `superjson` garante serialização correta de tipos como `Date`, `Map` e `Set` entre servidor e cliente.

---

## QueryClient Compartilhado

```typescript
// trpc/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto
      },
    },
  });
}
```

---

## Server Client (Server Components)

```typescript
// trpc/server.ts
import 'server-only';

import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { cache } from 'react'
import { makeQueryClient } from './query-client';
import { appRouter } from '~/server';
import { createContext } from '~/server/context';

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});
```

### Prefetch em Server Component

```typescript
// app/roast/[id]/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient, trpc } from '~/trpc/server';
import { ClientComponent } from './client-component';

export default async function RoastPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = getQueryClient();

  // ✅ await garante que os dados estejam prontos antes de renderizar
  await queryClient.prefetchQuery(
    trpc.submissions.getById.queryOptions({ id }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />
    </HydrationBoundary>
  );
}
```

---

## Client Provider

```typescript
// trpc/react.tsx
'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import { type AppRouter } from '~/server';

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  // Usa a mesma factory do servidor para garantir configurações consistentes
  const [queryClient] = useState(() => makeQueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          // Preparado para headers futuros (ex: tokens de rate limit)
          headers() {
            return {};
          },
        }),
      ],
      transformer: superjson,
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
```

---

## Routers

### Root Router

```typescript
// server/routers/_app.ts
import { submissionsRouter } from './submissions';
import { analysesRouter } from './analyses';
import { leaderboardRouter } from './leaderboard';
import { router } from '../trpc';

export const appRouter = router({
  submissions: submissionsRouter,
  analyses: analysesRouter,
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;
```

### Submissions Router

```typescript
// server/routers/submissions.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { submissions } from '~/db/schema';
import { eq, desc, gt } from 'drizzle-orm';

// Enum compartilhado para reuso (ex: no leaderboard)
export const languageEnum = z.enum([
  'javascript', 'typescript', 'python', 'java',
  'csharp', 'go', 'rust', 'ruby', 'php',
  'swift', 'kotlin', 'sql', 'html', 'css',
]);

export const submissionsRouter = router({
  create: publicProcedure
    .input(z.object({
      code: z.string().min(1),
      language: languageEnum,
      roastMode: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      const [submission] = await ctx.db
        .insert(submissions)
        .values({
          code: input.code,
          language: input.language,
          roastMode: input.roastMode,
        })
        .returning();
      return submission;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const submission = await ctx.db.query.submissions.findFirst({
        where: eq(submissions.id, input.id),
        with: {
          analysis: {
            with: {
              issues: true,
              diffs: true,
            },
          },
        },
      });
      return submission;
    }),

  list: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(20),
      cursor: z.string().uuid().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.query.submissions.findMany({
        limit: input.limit + 1,
        // ✅ Cursor manual via cláusula where — o Drizzle não suporta cursor nativo
        where: input.cursor ? gt(submissions.id, input.cursor) : undefined,
        orderBy: [desc(submissions.createdAt)],
        with: {
          analysis: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    }),
});
```

### Analyses Router

```typescript
// server/routers/analyses.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { analyses } from '~/db/schema';
import { eq } from 'drizzle-orm';

export const analysesRouter = router({
  getBySubmissionId: publicProcedure
    .input(z.object({ submissionId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const analysis = await ctx.db.query.analyses.findFirst({
        where: eq(analyses.submissionId, input.submissionId),
        with: {
          issues: true,
          diffs: true,
        },
      });
      return analysis;
    }),
});
```

### Leaderboard Router

```typescript
// server/routers/leaderboard.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { submissions } from '~/db/schema';
import { desc, eq, isNotNull } from 'drizzle-orm';
import { languageEnum } from './submissions';

export const leaderboardRouter = router({
  getTop: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      // ✅ Reutiliza o enum tipado — elimina o cast "as any"
      language: languageEnum.optional(),
    }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.query.submissions.findMany({
        where: input.language
          ? eq(submissions.language, input.language)
          : isNotNull(submissions.score),
        orderBy: [desc(submissions.score), desc(submissions.createdAt)],
        limit: input.limit,
        with: {
          analysis: true,
        },
      });
      return items;
    }),
});
```

---

## Server Index

```typescript
// server/index.ts
export { appRouter } from './routers/_app';
export type { AppRouter } from './routers/_app';
```

---

## TO-DOs

### Fase 1: Instalação
- [ ] Instalar dependências: `pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod superjson`
- [ ] Criar diretório `src/server/`
- [ ] Criar diretório `src/trpc/`

### Fase 2: Setup Básico
- [ ] Criar `server/context.ts`
- [ ] Criar `server/trpc.ts` (inicialização com superjson)
- [ ] Criar `trpc/query-client.ts` (factory compartilhada)
- [ ] Criar Route Handler em `app/api/trpc/[trpc]/route.ts` (com `onError`)
- [ ] Criar `trpc/server.ts` (getQueryClient + trpc proxy)

### Fase 3: Client Provider
- [ ] Criar `trpc/react.tsx` com TRPCProvider (usando `makeQueryClient`)
- [ ] Adicionar TRPCProvider em `app/layout.tsx`

### Fase 4: Routers
- [ ] Criar `server/routers/submissions.ts` (com `languageEnum` exportado)
- [ ] Criar `server/routers/analyses.ts`
- [ ] Criar `server/routers/leaderboard.ts` (importando `languageEnum`)
- [ ] Criar `server/routers/_app.ts` (root router)
- [ ] Criar `server/index.ts` (export AppRouter)

### Fase 5: Integração
- [ ] Criar componentes de exemplo usando os procedures
- [ ] Testar prefetch com `await` em Server Components

---

## Referências

- [tRPC Docs](https://trpc.io/docs)
- [tRPC with Server Components](https://trpc.io/docs/client/tanstack-react-query/server-components)
- [tRPC v11 Announcement](https://trpc.io/blog/2025-03-21-announcing-trpc-11)
- [TanStack Query](https://tanstack.com/query/latest)
- [superjson](https://github.com/flightcontrolhq/superjson)
