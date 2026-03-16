# Especificação: Editor de Código com Syntax Highlight

## Visão Geral

Este documento contém a especificação técnica para implementação do editor de código na homepage do DevRoast, com suporte a syntax highlight automático e manual.

## Requisitos Funcionais

### RF1: Entrada de Código
- O usuário pode colar ou digitar código no editor
- O código deve ser editável com suporte a múltiplas linhas
- Deve suportar tabulação (tecla Tab insere 2 espaços)

### RF2: Syntax Highlight Automático
- Detectar automaticamente a linguagem do código quando o usuário cola
- Aplicar cores de syntax highlight conforme a linguagem detectada
- Languages suportadas (inicialmente):
  - JavaScript / TypeScript
  - Python
  - Rust
  - Go
  - Java
  - C / C++
  - Ruby
  - PHP
  - Swift
  - Kotlin
  - SQL
  - HTML / CSS
  - JSON / YAML
  - Bash / Markdown

### RF3: Seleção Manual de Linguagem
- O usuário pode selecionar manualmente a linguagem via dropdown
- Opção de sobrescrever a detecção automática
- Lista de linguagens disponíveis deve ser a mesma do RF2

### RF4: Integração com Toggle "Roast Mode"
- O editor deve funcionar com o toggle "roast mode" já existente
- Não há dependência funcional entre o editor e o toggle

---

## Análise de Alternativas

### Opção A: Shiki (Recomendado)

**O que é:** Biblioteca de syntax highlighting que usa as mesmas grammars do VS Code.

**Prós:**
- ✅ Same engine do VS Code (alta qualidade visual)
- ✅ Já está sendo usada no projeto (`CodeBlock` existente usa Shiki)
- ✅ Suporta 100+ linguagens
- ✅ Temas customizáveis
- ✅ Server-side rendering suportado
- ✅ Usado pelo ray.so (referência do usuário)
- ✅ `codeToHtml` simples de usar

**Contras:**
- ⚠️ Bundle size maior (~3MB com todas linguagens)
- ⚠️ Performance pode ser afetada se carregado tudo de uma vez
- ⚠️ Detecção automática requer solução externa

**Implementação recomendada:**
```typescript
import { codeToHtml } from 'shiki'

const html = await codeToHtml(code, {
  lang: detectedLanguage,
  theme: 'vesper' // tema escuro usado no projeto
})
```

**Custo estimado:** ~500KB-1MB (com lazy loading de linguagens)

---

### Opção B: Highlight.js

**O que é:** Biblioteca de syntax highlighting leve e popular.

**Prós:**
- ✅ Bundle pequeno (~30KB minified)
- ✅ Suporta 190+ linguagens
- ✅ Detecção automática de linguagem nativa (`highlightAuto`)
- ✅ Muito usado na indústria

**Contras:**
- ⚠️ Qualidade visual inferior ao Shiki
- ✅ Tema diferente do padrão do projeto (não usa grammars do VS Code)
- ⚠️ Menos customizável

---

### Opção C: Prism.js

**O que é:** Biblioteca de highlighting leve e elegante.

**Prós:**
- ✅ Muito leve (~15KB)
- ✅ Fácil de usar
- ✅ Bom para casos simples

**Contras:**
- ⚠️ Não suporta tantas linguagens quanto highlight.js
- ⚠️ Qualidade inferior ao Shiki
- ⚠️ Sem detecção automática

---

### Opção D: Monaco Editor

**O que é:** Editor completo (mesmo engine do VS Code).

**Prós:**
- ✅ IDE completo no browser
- ✅ Syntax highlight automático
- ✅ IntelliSense, minimap, etc.

**Contras:**
- ⚠️ Bundle muito grande (5-10MB)
- ⚠️ Exagero para o caso de uso (apenas colar código)
- ⚠️ Complexidade desnecessária para "cola e recebe highlight"

---

### Opção E: CodeMirror 6

**O que é:** Editor moderno e modular.

**Prós:**
- ✅ Bundle menor que Monaco (~300KB base)
- ✅ Extensível
- ✅ Syntax highlighting incluso

**Contras:**
- ⚠️ Mais complexo de configurar
- ⚠️ Exagero para o caso de uso

---

## Decisão Final

**Recomendação: Shiki**

Justificativa:
1. Já está no projeto (CodeBlock usa Shiki)
2. Ray.so (referência do usuário) usa Shiki + highlight.js
3. Qualidade visual superior (mesmo engine do VS Code)
4. O caso de uso é "colar código e ver highlight" - Shiki é perfeito para isso

**Abordagem híbrida:**
- Usar Shiki para rendering com highlight
- Usar biblioteca externa para detecção automática de linguagem (ver TO-DO #2)

---

## Detecção Automática de Linguagem

### Opção 1: highlight.js (com `highlightAuto`)

```javascript
import hljs from 'highlight.js'

const result = hljs.highlightAuto(code)
console.log(result.language) // linguagem detectada
```

### Opção 2: flourite

Biblioteca leve específica para detecção de linguagem.

```javascript
import flourite from 'flourite'

const result = flourite(code)
console.log(result.language) // linguagem detectada
```

### Opção 3: microsoft/vscode-languagedetection

Mesma tecnologia usada pelo VS Code para detectar linguagens.

**Recomendação:** Usar `highlightAuto` do highlight.js por já estar no projeto (ray.so tem highlight.js como dependência).

---

## Arquitetura Sugerida

```
src/components/
├── code-editor.tsx          # Editor atual (textarea simples)
├── code-editor-highlight.tsx # NOVO: Editor com syntax highlight
```

**Fluxo:**
1. Usuário cola código no textarea
2. Sistema detecta linguagem automaticamente
3. Shiki renderiza o código com cores
4. Usuário pode sobrescrever via seletor manual

---

## TO-DOs

### TO-DO #1: Implementar CodeEditor com Shiki

- [ ] Criar componente `CodeEditorHighlight` baseado no `CodeBlock` existente
- [ ] Substituir textarea por área que exiba output do Shiki
- [ ] Permitir edição (sync entre textarea e preview Shiki)
- [ ] Manter o mesmo design visual (3 dots, números de linha, etc.)

**Pergunta:** O editor deve ser editável em tempo real (digitando e já vê o highlight) ou apenas visualizar após colar? Isso impacta diretamente na complexidade.

### TO-DO #2: Adicionar Detecção Automática

- [ ] Integrar detecção de linguagem (sugestão: highlight.js)
- [ ] Aplicar automaticamente quando código é colado
- [ ] Fallback para "text" se não detectar

### TO-DO #3: Adicionar Seletor de Linguagem

- [ ] Criar dropdown com lista de linguagens disponíveis
- [ ] Permitir sobrescrever detecção automática
- [ ] Atualizar highlight quando linguagem muda

### TO-DO #4: Otimização de Bundle

- [ ] Usar lazy loading de linguagens no Shiki
- [ ] Carregar apenas linguagens comuns inicialmente
- [ ] Carregar linguagens extras sob demanda

---

## Perguntas em Aberto

1. **Performance vs Qualidade:** Qual prioridade? Shiki é mais pesado mas muito mais bonito. Highlight.js é leve mas menos atraente.

2. **Detecção em tempo real:** A detecção deve ocorrer a cada keystroke ou apenas quando o usuário para de digitar (debounce)?

3. **Lista de linguagens:** Precisamos de todas as 100+ linguagens do Shiki ou um subconjunto menor (top 15-20)?

4. **Formato de output:** O código processado precisa ser enviado para API depois, ou é apenas para display local?

---

## Referências

- [Ray.so GitHub](https://github.com/raycast/ray-so) - Usa Shiki + highlight.js
- [Shiki Docs](https://shiki.style)
- [highlight.js](https://highlightjs.org/)
- [Flourite (detecção)](https://github.com/teknologi-umum/flourite)
- [Shiki Auto Detection](https://fsck.sh/en/blog/shiki-auto-detection-journey/)
