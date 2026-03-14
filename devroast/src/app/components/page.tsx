import { Button } from "@/components/ui";
import {
  AnalysisCardBadge,
  AnalysisCardDescription,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import {
  CodeCell,
  LangCell,
  LeaderboardRow,
  RankCell,
  ScoreCell,
} from "@/components/ui/leaderboard-row";
import { ScoreRing } from "@/components/ui/score-ring";
import { Toggle } from "@/components/ui/toggle";

const sampleCode = `function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}`;

const sections = [
  {
    title: "Button",
    description: "Botões com múltiplas variantes e tamanhos",
    children: (
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-text-secondary">Primary</span>
          <div className="flex gap-2">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-text-secondary">Secondary</span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Small
            </Button>
            <Button variant="secondary" size="md">
              Medium
            </Button>
            <Button variant="secondary" size="lg">
              Large
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-text-secondary">Outline</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Small
            </Button>
            <Button variant="outline" size="md">
              Medium
            </Button>
            <Button variant="outline" size="lg">
              Large
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-text-secondary">Ghost</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              Small
            </Button>
            <Button variant="ghost" size="md">
              Medium
            </Button>
            <Button variant="ghost" size="lg">
              Large
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-text-secondary">Destructive</span>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm">
              Small
            </Button>
            <Button variant="destructive" size="md">
              Medium
            </Button>
            <Button variant="destructive" size="lg">
              Large
            </Button>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Toggle",
    description: "Switch interativo com base-ui",
    children: (
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <Toggle checked={false} />
          <span className="font-mono text-sm text-text-secondary">OFF</span>
        </div>
        <div className="flex items-center gap-3">
          <Toggle checked={true} />
          <span className="font-mono text-sm text-text-secondary">ON</span>
        </div>
      </div>
    ),
  },
  {
    title: "Badge",
    description: "Status badges com variantes de cor",
    children: (
      <div className="flex flex-wrap gap-4">
        <Badge variant="critical">critical</Badge>
        <Badge variant="warning">warning</Badge>
        <Badge variant="good">good</Badge>
        <Badge variant="verdict">verdict</Badge>
      </div>
    ),
  },
  {
    title: "AnalysisCard",
    description: "Card composto com badge, título e descrição",
    children: (
      <div className="max-w-md">
        <AnalysisCardRoot>
          <AnalysisCardBadge variant="warning">warning</AnalysisCardBadge>
          <AnalysisCardTitle>using var instead of const/let</AnalysisCardTitle>
          <AnalysisCardDescription>
            the var keyword is function-scoped rather than block-scoped, which
            can lead to unexpected behavior and bugs. modern javascript uses
            const for immutable bindings and let for mutable ones.
          </AnalysisCardDescription>
        </AnalysisCardRoot>
      </div>
    ),
  },
  {
    title: "CodeBlock",
    description: "Server component com syntax highlighting (shiki tema vesper)",
    children: (
      <div className="max-w-lg">
        <CodeBlock
          code={sampleCode}
          language="javascript"
          filename="calculate.js"
          showHeader
        />
      </div>
    ),
  },
  {
    title: "DiffLine",
    description: "Linhas de diff com cores contextuais",
    children: (
      <div className="flex flex-col border-border-primary max-w-lg overflow-hidden">
        <DiffLine type="removed">const x = 1;</DiffLine>
        <DiffLine type="added">let x = 1;</DiffLine>
        <DiffLine type="context">const y = 2;</DiffLine>
      </div>
    ),
  },
  {
    title: "LeaderboardRow",
    description: "Linha de tabela para leaderboard",
    children: (
      <div className="flex flex-col rounded-lg border border-border-primary overflow-hidden">
        <LeaderboardRow>
          <RankCell>#1</RankCell>
          <ScoreCell>8.5</ScoreCell>
          <CodeCell>calculateTotal()</CodeCell>
          <LangCell>javascript</LangCell>
        </LeaderboardRow>
        <LeaderboardRow>
          <RankCell>#2</RankCell>
          <ScoreCell variant="critical">5.4</ScoreCell>
          <CodeCell>processData()</CodeCell>
          <LangCell>python</LangCell>
        </LeaderboardRow>
      </div>
    ),
  },
  {
    title: "ScoreRing",
    description: "Indicador circular de pontuação",
    children: (
      <div className="flex gap-8">
        <ScoreRing score={8.5} total={10} />
        <ScoreRing score={4.2} total={10} />
        <ScoreRing score={10} total={10} />
      </div>
    ),
  },
];

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-bg-page p-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <header>
          <h1 className="font-mono text-3xl font-bold text-text-primary">
            Component Library
          </h1>
          <p className="mt-2 text-text-secondary">
            Visualização de todos os componentes de UI do projeto
          </p>
        </header>

        {sections.map((section) => (
          <section key={section.title} className="space-y-4">
            <div>
              <h2 className="font-mono text-xl font-semibold text-text-primary">
                {section.title}
              </h2>
              <p className="text-text-secondary">{section.description}</p>
            </div>
            <div className="rounded-lg border border-border-primary bg-bg-surface p-6">
              {section.children}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
