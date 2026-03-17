# DevRoast - Padrões Globais do Projeto

## Visão Geral do Stack

- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **API**: tRPC v11
- **Styling**: Tailwind CSS v4 + tailwind-variants
- **Linting**: Biome
- **Package Manager**: pnpm

## Estrutura de Diretórios

```
src/
├── app/              # Next.js App Router (pages, layouts, API routes)
├── components/      # Componentes React
│   └── ui/          # Componentes de UI (ver AGENTS.md específico)
├── constants/       # Constantes globais
├── db/              # Schema e configurações do banco (ver AGENTS.md específico)
├── lib/             # Utilitários e bibliotecas
├── server/          # tRPC server (ver AGENTS.md específico)
└── trpc/            # Configuração tRPC client
```

## Convenções de Código

### Arquivos

- **命名**: kebab-case para arquivos (ex: `code-input-section.tsx`)
- **命名**: PascalCase para componentes (ex: `CodeInputSection`)
- **命名**: camelCase para funções e variáveis

### Imports

- **命名**: Use alias `@/` para imports internos
- **Ordem**: 1) libs externas 2) componentes internos 3) utilitários

```typescript
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MAX_CHARS } from "@/constants";
```

### Exports

- **Nunca use `export default`**
- Use named exports para tudo

```typescript
export function CodeInputSection() { }
export const statsRouter = router({ });
```

### Strings

- Use aspas duplas para strings
- Use template literals para interpolação

```typescript
const message = `Hello ${name}`;
```

### TypeScript

- Use `type` ao invés de `interface` para tipos simples
- Use `interface` para tipos que serão extendidos

```typescript
type Submission = typeof submissions.$inferSelect;
interface ComponentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
```

## Linting e Formatting

Execute antes de commitar:

```bash
pnpm lint     # biome check
pnpm format   # biome check --write --unsafe
```

Regras principais:
- 2 spaces de indentação
- 80 caracteres por linha
- LF line endings
- Semicolons obrigatórios
- Trailing commas em todos os lugares

## Variáveis de Ambiente

- **命名**: UPPER_SNAKE_CASE
- **Arquivo**: `.env` (nunca commitar)
- **Required**: `DATABASE_URL`

## PostgreSQL + Drizzle

- Schema em `src/db/schema.ts`
- Enum valores em snake_case (ex: `finding_level`)
- Timestamps com timezone: `timestamp("created_at", { withTimezone: true })`
- UUIDs com `defaultRandom()`
- Foreign keys com `onDelete: "cascade"`

## Tailwind CSS v4

- Cores definidas via `@theme` em `src/app/globals.css`
- Use classes canônicas (ex: `bg-accent-green`, `text-text-primary`)
- **Nunca use** `bg-(--color-*)` ou interpolação de strings para cores

## tRPC

- Procedimentos públicos: `publicProcedure`
- Routers em `src/server/routers/`
- Transformer: `superjson`

## Referências

- [Biome Config](./biome.json)
- [UI Components](./src/components/ui/AGENTS.md)
- [Database](./src/db/AGENTS.md)
- [tRPC Server](./src/server/AGENTS.md)
