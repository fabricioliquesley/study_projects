# Open Graph Image para Roasts

**Data:** 2026-03-17  
**Status:** Aprovado

## Objetivo

Gerar automaticamente imagens Open Graph para links compartilháveis dos resultados de roast, baseadas no design existente no arquivo `devroast.pen` (Screen 4 - OG Image).

## Escopo

- Criar API Route do Next.js para geração de imagens OG
- Criar componente React para renderização da imagem via Takumi
- Adicionar meta tags nas páginas de resultado de roast

## Fora do Escopo

- Pré-geração estática de imagens (ISR)
- Alterações no schema do banco de dados

---

## Design Detalhado

### 1. Arquitetura

Criar API Route em `/app/api/og/[id]/route.ts`:

```
Request: GET /api/og/[id]
  │
  ├─► Buscar dados do roast via tRPC (submission.getById)
  │
  └─► Renderizar imagem com Takumi ImageResponse
        │
        ├─► Componente: src/components/og/roast-image.tsx
        ├─► Dimensões: 1200x630
        └─► Formato: webp
```

### 2. Dados Necessários

| Dado | Origem | Tipo |
|------|--------|------|
| score | submission.score | number |
| language | submission.language | string |
| roastSummary | analysis.roastSummary | string |
| criticalCount | issues.filter(severity=critical).length | number |
| warningCount | issues.filter(severity=warning).length | number |
| goodCount | issues.filter(severity=good).length | number |

### 3. Componente de Imagem

**Local:** `src/components/og/roast-image.tsx`

**Estrutura visual** (baseada no design `devroast.pen`):

```
┌─────────────────────────────────────────────┐
│                                             │
│           [logo] devroast                   │
│                                             │
│                 3.5                         │
│                /10                          │
│                                             │
│        ●  Critical  Warning  Good           │
│                                             │
│            lang: javascript                 │
│                                             │
│      "this code was written during a        │
│        power outage..."                     │
│                                             │
└─────────────────────────────────────────────┘
```

**Cores do tema** (Tailwind):
- Background: `--bg-page` (#0f0f0f ou similar)
- Texto primário: `--text-primary`
- Texto terciário: `--text-tertiary`
- Score: `--accent-amber`
- Badge Critical: `--accent-red`
- Badge Warning: `--accent-amber` 
- Badge Good: `--accent-green`
- Logo: `--accent-green`

### 4. API Route

**Local:** `src/app/api/og/[id]/route.ts`

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

### 5. Meta Tags

**Arquivo:** `src/app/roast/[id]/page.tsx`

Adicionar função `generateMetadata`:

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

---

## Dependências

```bash
pnpm add @takumi-rs/image-response
```

---

## Testes

- Verificar que `/api/og/[id]` retorna imagem com status 200
- Verificar que meta tags são geradas corretamente
- Verificar caching com headers apropriados

---

## Riscos

1. **Performance:** Queries ao banco a cada request. Mitigado com caching de 1h.
2. **Fontes:** Takumi usa fontes padrão. Pode necessitar de fontes customizadas para matching com design.

---

## Alternativas Consideradas

1. **Pré-geração (ISR):** Mais performático mas mais complexo. Adiado para futuro.
2. **Salvar no banco:** Gera overhead de storage. Não necessário para MVP.
