# Open Graph Image para Roasts Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gerar automaticamente imagens Open Graph para links compartilháveis dos resultados de roast usando Takumi.

**Architecture:** API Route Next.js que busca dados via tRPC e renderiza imagem com Takumi ImageResponse. Caching via headers HTTP.

**Tech Stack:** Next.js 16, Takumi (@takumi-rs/image-response), tRPC

---

## File Structure

```
src/
├── app/api/og/[id]/route.ts    # API Route para gerar OG image
└── components/og/
    └── roast-image.tsx         # Componente React para renderizar imagem
```

Modificar:
```
src/app/roast/[id]/page.tsx     # Adicionar generateMetadata
```

---

## Task 1: Instalar dependência Takumi

- [ ] **Step 1: Instalar @takumi-rs/image-response**

Run: `cd /home/fabricio/Documentos/study_projects/devroast && pnpm add @takumi-rs/image-response`

---

## Task 2: Criar componente RoastOgImage

**Files:**
- Create: `src/components/og/roast-image.tsx`

- [ ] **Step 1: Criar componente com tipos e interface**

```typescript
interface RoastOgImageProps {
  score: number;
  language: string;
  roastSummary: string;
  criticalCount: number;
  warningCount: number;
  goodCount: number;
}

export function RoastOgImage({
  score,
  language,
  roastSummary,
  criticalCount,
  warningCount,
  goodCount,
}: RoastOgImageProps) {
  // Layout baseado em devroast.pen - Screen 4 - OG Image
  // 1200x630 com:
  // - Logo "devroast" com >
  // - Score grande "X.X/10"
  // - 3 badges: Critical, Warning, Good com contagens
  // - Linguagem
  // - Citação do roast
}
```

- [ ] **Step 2: Implementar render com Takumi**

```typescript
// Usar estilos inline compatíveis com Takumi
// Cores usarão valores hex aproximada baseados no tema:
// - bg-page: #0f0f0f (dark)
// - text-primary: #ededed
// - text-tertiary: #71717a
// - accent-amber: #f59e0b
// - accent-red: #ef4444
// - accent-green: #22c55e
// - accent-green (logo): #22c55e
```

- [ ] **Step 3: Commit**

```bash
git add src/components/og/roast-image.tsx
git commit -m "feat: add RoastOgImage component for Open Graph generation"
```

---

## Task 3: Criar API Route

**Files:**
- Create: `src/app/api/og/[id]/route.ts`

- [ ] **Step 1: Criar a API route**

```typescript
import ImageResponse from "@takumi-rs/image-response";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createCallerFactory } from "@/server/trpc";
import { RoastOgImage } from "@/components/og/roast-image";

const createCaller = createCallerFactory(appRouter);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ctx = await createContext();
  const caller = createCaller(ctx);

  const result = await caller.submission.getById(id);

  if (!result || !result.submission) {
    return new Response("Not Found", { status: 404 });
  }

  const { submission, analysis, issues } = result;

  const score = submission.score ?? 0;
  const language = submission.language;
  const roastSummary = analysis?.roastSummary ?? "No analysis available.";

  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const goodCount = issues.filter((i) => i.severity === "good").length;

  return new ImageResponse(
    <RoastOgImage
      score={score}
      language={language}
      roastSummary={roastSummary}
      criticalCount={criticalCount}
      warningCount={warningCount}
      goodCount={goodCount}
    />,
    {
      width: 1200,
      height: 630,
      format: "webp",
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
```

- [ ] **Step 2: Testar a route manualmente**

Run: `pnpm dev` e acessar `http://localhost:3000/api/og/[id-valido]`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/og/
git commit -m "feat: add OG image API route for roast sharing"
```

---

## Task 4: Adicionar Meta Tags

**Files:**
- Modify: `src/app/roast/[id]/page.tsx`

- [ ] **Step 1: Adicionar generateMetadata**

Verificar se já existe generateMetadata. Se não, adicionar:

```typescript
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return {
    other: {
      "og:image": `/api/og/${id}`,
      "og:image:width": "1200",
      "og:image:height": "630",
    },
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/roast/[id]/page.tsx
git commit -m "feat: add Open Graph meta tags to roast result page"
```

---

## Task 5: Testes e Verificação

- [ ] **Step 1: Verificar que a OG image funciona**

Acessar `/api/og/[id]` e verificar:
- Status 200
- Content-Type: image/webp
- Imagem renderizada corretamente

- [ ] **Step 2: Verificar meta tags**

Inspecionar página `/roast/[id]` e verificar presença de:
- `og:image`
- `og:image:width`
- `og:image:height`

- [ ] **Step 3: Run lint**

Run: `pnpm lint`

---

## Verificação Final

- [ ] API Route retorna imagem corretamente
- [ ] Meta tags estão presentes na página
- [ ] Dados dinâmicos aparecem: score, badges, language, roast summary
- [ ] Cache headers configurados
- [ ] Lint passa

---

**Fim do plano.**
