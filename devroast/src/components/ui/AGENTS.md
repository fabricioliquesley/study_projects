# UI Components — Padrões de Criação

Guia de referência para manter consistência ao criar novos componentes na pasta `src/components/ui`.

## Regras gerais

1. **Named exports apenas** — nunca use `export default`.
2. **Exporte o componente, a função de variantes (`tv`), e os tipos** para permitir reuso e composição.
3. **Estenda as props nativas do HTML** usando `ComponentProps<"elemento">` do React.
4. **Não declare `className` manualmente no tipo** — ela já vem de `ComponentProps`.
5. **Um arquivo por componente** — nomeie o arquivo em kebab-case (ex: `button.tsx`, `text-field.tsx`).

## Estilização

### Tailwind Variants (`tv`)

Use `tailwind-variants` para definir todas as variantes do componente:

import { tv, type VariantProps } from "tailwind-variants";

const component = tv({
  base: [...],
  variants: {
    variant: { ... },
    size: { ... },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

### Merge de classes

**Componentes com `tv()`:** passe `className` como propriedade na chamada da função `tv`, que já faz merge internamente:

function Component({ variant, size, className, ...props }: ComponentProps) {
  return (
    <div className={component({ variant, size, className })} {...props} />
  );
}

**Componentes sem `tv()`:** use `twMerge` para unir classes base com `className`:

import { twMerge } from "tailwind-merge";

function Component({ className, ...props }: ComponentProps) {
  return (
    <div className={twMerge("base-classes here", className)} {...props} />
  );
}

**NUNCA use interpolação de string** para unir `className`:

// ERRADO
className={`base-classes ${className ?? ""}`}

// CERTO
className={twMerge("base-classes", className)}

**Nota:** quando um sub-componente não possui variantes próprias, prefira `twMerge` simples em vez de criar um `tv()` inline dentro da função, para evitar recálculos desnecessários em renders.

### Cores — Tailwind `@theme` variables

Todas as cores customizadas do projeto são definidas no bloco `@theme` do `globals.css` usando o namespace `--color-*`.
O Tailwind v4 gera automaticamente classes utilitárias nativas a partir dessas variáveis.

**Exemplo de definição em `@theme`:**

@theme {
  --color-accent-green: #10b981;
  --color-bg-page: #0a0a0a;
  --color-text-primary: #fafafa;
  --color-border-primary: #2a2a2a;
}

**Uso nos componentes — classes canônicas:**

bg-accent-green          // fundo verde
text-text-primary        // texto primário
border-border-primary    // borda
bg-bg-page               // fundo da página
text-accent-red          // texto vermelho
bg-diff-added            // fundo de linha adicionada

**NUNCA use** a sintaxe `bg-(--color-accent-green)` ou `bg-[var(--color-accent-green)]`.
Use sempre a classe canônica gerada pelo Tailwind (ex: `bg-accent-green`).

**Exceção:** atributos SVG como `stroke`, `fill`, `stopColor` não aceitam classes Tailwind.
Nesses casos, use `var(--color-*)` diretamente:

<circle stroke="var(--color-border-primary)" />
<stop stopColor="var(--color-accent-green)" />

### Cores nativas do Tailwind

Quando a cor corresponde a uma utilidade nativa do Tailwind, **use a classe nativa** em vez de referenciar a variável customizada. Exemplos:

text-white           // em vez de text-[#ffffff]
text-black           // em vez de text-[#000000]
bg-transparent       // em vez de bg-[transparent]

### Prefixos das variáveis de cor

- `--color-bg-*` — fundos (gera `bg-bg-*`)
- `--color-text-*` — texto (gera `text-text-*`)
- `--color-border-*` — bordas (gera `border-border-*`)
- `--color-accent-*` — cores de destaque (gera `bg-accent-*`, `text-accent-*`)
- `--color-diff-*` — fundos de diff (gera `bg-diff-*`)
- `--color-primary` / `--color-destructive` — ações principais

### Fontes

As fontes são configuradas via `@theme` no `globals.css` usando variáveis do Tailwind:

- `font-sans` — fonte padrão do sistema (sans-serif). Aplicada ao `<body>` por padrão.
- `font-mono` — JetBrains Mono (monospace). Usar para texto de código, terminais, labels estilizados.

**Nunca crie classes customizadas** como `font-primary` ou `font-secondary`.
Use exclusivamente `font-sans` e `font-mono` do Tailwind.

## Composição vs Props

Use o **pattern de composição** (sub-componentes) quando o componente possui pedaços visuais distintos (título, descrição, ícone, etc.) que o consumidor pode querer reorganizar ou omitir.

Use **props simples** quando o componente é um primitivo atômico (`Button`, `Badge`, `Toggle`) ou quando as props são dados de configuração/cálculo, não sub-elementos visuais (`ScoreRing`, `CodeBlock`).

### Quando usar composição

- O componente tem 2+ áreas de conteúdo semanticamente distintas (título, descrição, badge, etc.)
- O consumidor pode querer trocar, omitir ou reorganizar sub-elementos
- Ex: `AnalysisCard`, `LeaderboardRow`

### Quando NÃO usar composição

- Componentes atômicos com `children` simples (`Button`, `Badge`, `DiffLine`)
- Componentes com props de configuração numérica/funcional (`ScoreRing`, `CodeBlock`)
- Toggle/inputs com label como prop simples

### Estrutura de composição

Use **named exports individuais** com prefixo do componente (nunca dot notation):

import type { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const card = tv({
  base: ["flex flex-col gap-3 p-5", "border border-border-primary"],
});

type CardRootProps = ComponentProps<"div">;

function CardRoot({ className, ...props }: CardRootProps) {
  return <div className={card({ className })} {...props} />;
}

type CardTitleProps = ComponentProps<"p">;

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <p
      className={tv({ base: "font-mono text-[13px] text-text-primary" })({
        className,
      })}
      {...props}
    />
  );
}

type CardDescriptionProps = ComponentProps<"p">;

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={tv({ base: "text-xs leading-relaxed text-text-secondary" })({
        className,
      })}
      {...props}
    />
  );
}

export {
  CardRoot,
  CardTitle,
  CardDescription,
  card,
  type CardRootProps,
  type CardTitleProps,
  type CardDescriptionProps,
};

**Uso:**

<CardRoot>
  <Badge variant="critical">critical</Badge>
  <CardTitle>using var instead of const/let</CardTitle>
  <CardDescription>the var keyword is...</CardDescription>
</CardRoot>

## Estrutura do componente (primitivo simples)

import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

// 1. Definir variantes com tv()
const myComponent = tv({
  base: [...],
  variants: { ... },
  defaultVariants: { ... },
});

// 2. Extrair tipo das variantes
type MyComponentVariants = VariantProps<typeof myComponent>;

// 3. Combinar com props nativas do elemento HTML
type MyComponentProps = ComponentProps<"div"> & MyComponentVariants;

// 4. Implementar o componente
function MyComponent({ variant, size, className, ...props }: MyComponentProps) {
  return (
    <div className={myComponent({ variant, size, className })} {...props} />
  );
}

// 5. Named exports de tudo
export {
  MyComponent,
  myComponent,
  type MyComponentProps,
  type MyComponentVariants,
};

## Elementos interativos com `forwardRef`

Componentes que precisam receber refs (inputs, buttons, elementos interativos) devem usar `forwardRef` e incluir `displayName` para melhor suporte em ferramentas de desenvolvimento como React DevTools.

import { forwardRef, type ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const input = tv({
  base: [...],
  variants: { ... },
  defaultVariants: { ... },
});

type InputVariants = VariantProps<typeof input>;
type InputProps = ComponentProps<"input"> & InputVariants;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, size, className, ...props }, ref) => (
    <input
      ref={ref}
      className={input({ variant, size, className })}
      {...props}
    />
  )
);

Input.displayName = "Input";

export {
  Input,
  input,
  type InputProps,
  type InputVariants,
};

**Usar `forwardRef` quando:**

- O elemento é interativo (input, button, textarea, select)
- O consumidor pode precisar acessar ou controlar o DOM diretamente
- O componente embrulha um elemento HTML com comportamento

**displayName é obrigatório** para componentes forwardRef, pois sem ele React exibirá `ForwardRef(Unknown)` no DevTools.

## Estados visuais (disabled, loading, error)

Componentes interativos devem suportar estados visuais consistentes usando `compoundVariants`:

const button = tv({
  base: "px-4 py-2 rounded font-medium transition",
  variants: {
    variant: {
      primary: "bg-accent-green text-white",
      secondary: "bg-border-primary text-text-primary",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed pointer-events-none",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      disabled: true,
      class: "hover:bg-accent-green",
    },
  ],
  defaultVariants: {
    variant: "primary",
    disabled: false,
  },
});

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof button>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, disabled, className, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={button({ variant, disabled, className })}
      {...props}
    />
  )
);

Button.displayName = "Button";

export { Button, button, type ButtonProps };

**Estados comuns a implementar:**

| Estado | Quando usar | Exemplo |
|--------|-----------|---------|
| `disabled` | Elemento não interativo | Botão desabilitado, input bloqueado |
| `loading` | Operação assíncrona em progresso | Spinner, skeleton, redução de opacidade |
| `error` | Validação falhou ou erro ocorreu | Borda vermelha, ícone de erro, mensagem |
| `success` | Ação completada com sucesso | Cor verde, ícone de checkmark |

Use `compoundVariants` para combinar estados (ex: `disabled` + `primary` podem ter estilos diferentes).

## Componentes controlados vs não-controlados

Diferencie entre componentes **controlados** (estado gerenciado externamente) e **não-controlados** (estado interno).

### Componentes não-controlados (recomendado para simplicidade)

Use quando o componente gerencia seu próprio estado interno:

type ToggleProps = ComponentProps<"button"> & {
  defaultChecked?: boolean;
  onToggle?: (checked: boolean) => void;
};

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ defaultChecked = false, onToggle, ...props }, ref) => {
    const [checked, setChecked] = useState(defaultChecked);

    const handleClick = () => {
      const newState = !checked;
      setChecked(newState);
      onToggle?.(newState);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        aria-pressed={checked}
        {...props}
      />
    );
  }
);

Toggle.displayName = "Toggle";

### Componentes controlados (quando necessário)

Use quando o estado precisa ser sincronizado com o consumidor:

type SelectProps = ComponentProps<"select"> & {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ value, onChange, options, ...props }, ref) => (
    <select
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
);

Select.displayName = "Select";

**Diretriz:** prefira não-controlados quando possível (simplicidade). Use controlados para síncronia complexa entre componentes.

## Acessibilidade

Componentes devem ser acessíveis por padrão. Siga estas regras:

### Elementos semânticos

- Use `<button>` para ações, nunca `<div onClick>` simulando botão
- Use `<a>` para navegação, nunca `<button>` com rota
- Use `<label htmlFor="id">` para associar labels a inputs
- Estruture com heading hierarchy apropriada (`<h1>` > `<h2>` > `<h3>`)

### ARIA attributes

Adicione atributos ARIA quando o conteúdo visual não for suficiente:

// Input com label implícito
<label htmlFor="search">
  Pesquisar
  <input id="search" type="text" />
</label>

// Botão com ícone (sem texto)
<button aria-label="Fechar modal">
  <CloseIcon />
</button>

// Toggle/Switch
<button aria-pressed={checked} role="switch">
  Ativar notificações
</button>

// Descrição de erro
<input
  id="email"
  type="email"
  aria-describedby="email-error"
/>
<span id="email-error" className="text-error">
  Email inválido
</span>

### Navegação por teclado

- Elementos interativos devem ser focáveis via `Tab`
- `forwardRef` facilita capture de refs para controle programático
- Use `role="button"` apenas se for um `<div>` simulando botão (evite isso)

## Checklist para novos componentes

- [ ] Arquivo em kebab-case dentro de `src/components/ui/`
- [ ] Named exports (componente, função tv, tipos)
- [ ] Props nativas estendidas via `ComponentProps<"elemento">`
- [ ] Variantes definidas com `tailwind-variants`
- [ ] `className` passado via `tv({ ..., className })` ou `twMerge()` (nunca interpolação de string)
- [ ] Cores via classes canônicas do Tailwind (`bg-accent-green`, `text-text-primary`)
- [ ] Classes nativas do Tailwind quando aplicável (`text-white`, `bg-transparent`)
- [ ] Fontes via `font-sans` / `font-mono` (nunca classes customizadas)
- [ ] Sem cores hex hardcoded (exceto atributos SVG com `var(--color-*)`)
- [ ] Sem `export default`
- [ ] Sem sintaxe `bg-(--color-*)` — usar classe canônica
- [ ] Composição (sub-componentes) para componentes com 2+ áreas de conteúdo distintas
- [ ] Props simples para primitivos atômicos e configuração numérica/funcional
- [ ] **Usar `forwardRef` para elementos interativos** e incluir `displayName`
- [ ] **Implementar estados visuais** (`disabled`, `loading`, `error`) com `compoundVariants` quando aplicável
- [ ] **Escolher entre controlado vs não-controlado** e documentar claramente
- [ ] **Seguir padrões de acessibilidade** (elementos semânticos, ARIA, navegação por teclado)
- [ ] Adicionar variante na página de exemplos (`/components`)