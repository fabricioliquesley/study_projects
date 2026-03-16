# Especificação de Implementação - Drizzle ORM

## Visão Geral

Este documento define a estrutura de banco de dados necessária para o projeto DevRoast utilizando Drizzle ORM com PostgreSQL.

## Stack

- **ORM**: Drizzle ORM
- **Banco de Dados**: PostgreSQL
- **Infraestrutura**: Docker Compose

---

## Enums

### `language`

Linguagens de programação suportadas para análise de código.

> ⚠️ **Nota:** Enums são rígidos — adicionar uma nova linguagem requer uma migration. Considere usar `varchar` com validação na camada de aplicação caso o suporte a novas linguagens seja frequente.

```typescript
export const languageEnum = pgEnum('language', [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'go',
  'rust',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
]);
```

### `finding_level`

Nível do resultado encontrado no código. Renomeado de `severity` para refletir melhor que `good` também é um resultado válido.

```typescript
export const findingLevelEnum = pgEnum('finding_level', [
  'critical',
  'warning',
  'good',
]);
```

### `issue_type`

Categorização dos problemas encontrados.

```typescript
export const issueTypeEnum = pgEnum('issue_type', [
  'naming',
  'performance',
  'security',
  'best_practice',
  'syntax',
  'style',
  'error_handling',
  'architecture',
  'documentation',
  'logic',
]);
```

---

## Tabelas

### 1. `submissions`

Armazena os códigos submetidos pelos usuários para análise.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|------------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | Identificador único |
| `code` | `text` | NOT NULL | Código fonte submetido |
| `language` | `language` | NOT NULL | Linguagem do código |
| `roast_mode` | `boolean` | DEFAULT false | Se modo sarcástico está ativado (opt-in) |
| `score` | `integer` | CHECK (score >= 0 AND score <= 10) | Nota de 0-10 calculada |
| `created_at` | `timestamptz` | DEFAULT NOW() | Data de criação (com timezone) |

### 2. `analyses`

Armazena os resultados detalhados da análise de código.

> ℹ️ **Nota:** As contagens de issues (`total_issues`, `critical_count`, etc.) foram removidas por serem dados derivados. Esses valores devem ser obtidos via `COUNT` agregado na tabela `issues`, evitando inconsistências por sincronização manual.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|------------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | Identificador único |
| `submission_id` | `uuid` | FK → submissions.id, UNIQUE, ON DELETE CASCADE | Referência à submissão (relação 1:1) |
| `roast_summary` | `text` | | Resumo sarcástico da análise |
| `created_at` | `timestamptz` | DEFAULT NOW() | Data de criação (com timezone) |

### 3. `issues`

Problemas individuais encontrados durante a análise.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|------------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | Identificador único |
| `analysis_id` | `uuid` | FK → analyses.id, ON DELETE CASCADE | Referência à análise |
| `severity` | `finding_level` | NOT NULL | Nível do resultado |
| `issue_type` | `issue_type` | NOT NULL | Tipo do problema |
| `line` | `integer` | | Linha onde ocorre o problema |
| `column` | `integer` | | Coluna onde ocorre o problema |
| `description` | `text` | NOT NULL | Descrição do problema |
| `roast_comment` | `text` | | Comentário sarcástico |
| `created_at` | `timestamptz` | DEFAULT NOW() | Data de criação (com timezone) |

### 4. `diffs`

Sugestões de correção do código.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|------------|
| `id` | `uuid` | PK, DEFAULT gen_random_uuid() | Identificador único |
| `issue_id` | `uuid` | FK → issues.id, ON DELETE CASCADE | Referência ao problema |
| `original_code` | `text` | NOT NULL | Trecho de código original |
| `fixed_code` | `text` | NOT NULL | Trecho de código corrigido |
| `explanation` | `text` | | Explicação da correção |
| `created_at` | `timestamptz` | DEFAULT NOW() | Data de criação (com timezone) |

---

## Arquivo de Configuração

### `drizzle.config.ts`

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### `src/db/schema.ts`

```typescript
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  index,
  unique,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const languageEnum = pgEnum('language', [
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'go',
  'rust',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
]);

export const findingLevelEnum = pgEnum('finding_level', [
  'critical',
  'warning',
  'good',
]);

export const issueTypeEnum = pgEnum('issue_type', [
  'naming',
  'performance',
  'security',
  'best_practice',
  'syntax',
  'style',
  'error_handling',
  'architecture',
  'documentation',
  'logic',
]);

export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull(),
  language: languageEnum('language').notNull(),
  roastMode: boolean('roast_mode').default(false), // opt-in explícito
  score: integer('score'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// Check constraint para score (0-10) deve ser adicionado via SQL raw na migration:
// ALTER TABLE submissions ADD CONSTRAINT score_range CHECK (score >= 0 AND score <= 10);

export const analyses = pgTable(
  'analyses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    submissionId: uuid('submission_id')
      .references(() => submissions.id, { onDelete: 'cascade' })
      .unique(), // garante relação 1:1
    roastSummary: text('roast_summary'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    submissionIdIdx: index('analyses_submission_id_idx').on(t.submissionId),
  })
);

export const issues = pgTable(
  'issues',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    analysisId: uuid('analysis_id').references(() => analyses.id, {
      onDelete: 'cascade',
    }),
    severity: findingLevelEnum('severity').notNull(),
    issueType: issueTypeEnum('issue_type').notNull(),
    line: integer('line'),
    column: integer('column'),
    description: text('description').notNull(),
    roastComment: text('roast_comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    analysisIdIdx: index('issues_analysis_id_idx').on(t.analysisId),
  })
);

export const diffs = pgTable(
  'diffs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    issueId: uuid('issue_id').references(() => issues.id, {
      onDelete: 'cascade',
    }),
    originalCode: text('original_code').notNull(),
    fixedCode: text('fixed_code').notNull(),
    explanation: text('explanation'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    issueIdIdx: index('diffs_issue_id_idx').on(t.issueId),
  })
);
```

### `src/db/connection.ts`

Responsável **exclusivamente** pela instância de conexão com o banco. Não exporta schemas.

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);
```

### `src/db/index.ts`

Ponto de entrada único para o restante da aplicação. Re-exporta a conexão e os schemas.

```typescript
export { db } from './connection';
export * from './schema';
```

---

## Docker Compose

### `docker-compose.yml`

> ℹ️ **Nota:** A chave `version` foi removida — ela está deprecada no Docker Compose v2+ e gera warnings desnecessários.

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: devroast-db
    environment:
      POSTGRES_USER: devroast
      POSTGRES_PASSWORD: devroast
      POSTGRES_DB: devroast
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devroast"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### `.env`

```env
DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast
```

---

## To-Dos para Implementação

### Fase 1: Infraestrutura
- [ ] Criar arquivo `docker-compose.yml` na raiz do projeto
- [ ] Criar arquivo `.env` com `DATABASE_URL`
- [ ] Criar arquivo `drizzle.config.ts`
- [ ] Criar diretório `src/db/`

### Fase 2: Schema
- [ ] Criar arquivo `src/db/schema.ts` com todas as tabelas e enums
- [ ] Criar arquivo `src/db/connection.ts` para instância de conexão com o banco
- [ ] Criar arquivo `src/db/index.ts` para re-exportar conexão e schemas

### Fase 3: Dependências
- [ ] Instalar dependências do Drizzle: `drizzle-orm`, `drizzle-kit`
- [ ] Instalar driver PostgreSQL: `postgres`
- [ ] Executar `pnpm add drizzle-orm postgres && pnpm add -D drizzle-kit`

### Fase 4: Migrações
- [ ] Executar `pnpm drizzle-kit generate`
- [ ] Adicionar manualmente o check constraint de `score` no arquivo de migration gerado
- [ ] Executar `pnpm drizzle-kit migrate`
- [ ] Verificar criação das tabelas no banco

### Fase 5: Integração
- [ ] Criar arquivo `src/db/queries.ts` para operações CRUD
- [ ] Integrar com as rotas da API quando necessário

---

## Considerações

1. **Sem autenticação**: O sistema não requer login, cada submissão pode ser anônima
2. **Leaderboard**: A ordenação será feita pela coluna `score` da tabela `submissions`
3. **Estatísticas globais**: Devem ser calculadas via agregação das tabelas — ex: `COUNT(*)` nas `issues` agrupado por `analysis_id` e `severity`
4. **Extensibilidade**: Schema permite adicionar novos tipos de issues facilmente; novas linguagens exigem uma migration no enum
5. **Dados derivados**: Contagens (`total_issues`, `critical_count`, etc.) são computadas sob demanda via query, não armazenadas, evitando inconsistências
