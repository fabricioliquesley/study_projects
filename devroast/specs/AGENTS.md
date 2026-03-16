# Formato de Especificação

## Estrutura

```
# Especificação: [Nome da Feature]

## Visão Geral
Breve descrição do objetivo.

## [Seções técnicas conforme necessidade]
- Requisitos Funcionais
- Análise de Alternativas
- Decisão Final
- Arquitetura Sugerida
- TO-DOs
- Referências
```

## Regras

1. **Uma feature por arquivo**: `specs/nome-da-feature.md`
2. **Decisões com justificativa**: Sempre explicar o "porquê" da escolha
3. **Analisar alternativas**: Listar pelo menos 2-3 opções com prós/contras
4. **Código de exemplo**: Incluir snippets quando relevante
5. **TO-DOs explícitos**: Listar tarefas de implementação
6. **Referências**: Links úteis (docs, libs, artigos)

## Nomenclatura

- Arquivos: kebab-case (ex: `drizzle-implementation.md`)
- Enums/Tabelas: snake_case (ex: `finding_level`)
- Variáveis/Componentes: camelCase (ex: `codeEditor`)
