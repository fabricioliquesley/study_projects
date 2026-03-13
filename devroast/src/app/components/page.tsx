import { Button } from "@/components/ui";

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
