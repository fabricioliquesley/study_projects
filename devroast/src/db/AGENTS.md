# Database - Padrões e Convenções

## Visão Geral

Este documento define os padrões para implementação de banco de dados usando Drizzle ORM com PostgreSQL.

## Estrutura de Arquivos

```
src/db/
├── index.ts         # Exporta db e schema
├── connection.ts    # Conexão com PostgreSQL
├── schema.ts       # Definição das tabelas
├── queries.ts      # Queries reutilizáveis
└── seed.ts         # Seed do banco
```

## Configuração

### connection.ts

```typescript
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client);
```

### drizzle.config.ts

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Schema

### Tabelas

Defina tabelas usando `pgTable`:

```typescript
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull(),
  language: languageEnum("language").notNull(),
  roastMode: boolean("roast_mode").default(false),
  score: integer("score"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
```

### Enums

Use `pgEnum` para enums:

```typescript
export const findingLevelEnum = pgEnum("finding_level", [
  "critical",
  "warning",
  "good",
]);

export const languageEnum = pgEnum("language", [
  "javascript",
  "typescript",
  "python",
  // ...
]);
```

### Foreign Keys

Defina referências com `references()` e `onDelete: "cascade"`:

```typescript
export const analyses = pgTable(
  "analyses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    submissionId: uuid("submission_id")
      .references(() => submissions.id, { onDelete: "cascade" })
      .unique(),
    // ...
  },
  (t) => ({
    submissionIdIdx: index("analyses_submission_id_idx").on(t.submissionId),
  }),
);
```

### Índices

Crie índices na função de retorno do segundo argumento:

```typescript
export const issues = pgTable(
  "issues",
  {
    // columns...
  },
  (t) => ({
    analysisIdIdx: index("issues_analysis_id_idx").on(t.analysisId),
  }),
);
```

### Tipos

Exporte tipos inferidos do Drizzle:

```typescript
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type Analysis = typeof analyses.$inferSelect;
export type NewAnalysis = typeof analyses.$inferInsert;
```

## Convenções de Nomenclatura

- **Tabelas**: snake_case (ex: `submissions`, `analyses`, `issues`)
- **Colunas**: camelCase (ex: `createdAt`, `submissionId`)
- **Índices**: `tabela_coluna_idx` (ex: `issues_analysis_id_idx`)
- **Enums**: snake_case (ex: `finding_level`, `language`)

## Regras

1. **UUIDs**: Use `uuid("id").defaultRandom().primaryKey()` para IDs
2. **Timestamps**: Sempre use `{ withTimezone: true }`
3. **Foreign Keys**: Sempre adicione `onDelete: "cascade"`
4. **Índices**: Adicione em colunas frequentemente consultadas
5. **Enum valores**: Sempre em snake_case
6. **Nome exports**: Exporte tipos `Select` e `Insert` para cada tabela
