import { faker } from "@faker-js/faker";
import { db } from "./connection";
import { analyses, diffs, issues, submissions } from "./schema";

const languages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "sql",
  "html",
  "css",
] as const;

const severities = ["critical", "warning", "good"] as const;
const issueTypes = [
  "naming",
  "performance",
  "security",
  "best_practice",
  "syntax",
  "style",
  "error_handling",
  "architecture",
  "documentation",
  "logic",
] as const;

const codeTemplates: Record<string, string[]> = {
  javascript: [
    `function add(a,b){return a+b}`,
    `var x = 10; var y = 20;`,
    `const data = []; data.push(1);`,
    `for(var i=0;i<10;i++){console.log(i)}`,
    `if(x=5){console.log('yes')}`,
  ],
  typescript: [
    `const x: number = 10;`,
    `interface User { name: string; }`,
    `type Status = 'active' | 'inactive';`,
    `function greet(name: string): string { return name; }`,
    `const arr: Array<number> = [];`,
  ],
  python: [
    `def add(a,b):return a+b`,
    `x = 10`,
    `for i in range(10):print(i)`,
    `if x=5: print('yes')`,
    `import numpy as np`,
  ],
  java: [
    `public class Main { public static void main(String[] args) {} }`,
    `int x = 10;`,
    `for(int i=0;i<10;i++){}`,
    `if(x=5){}`,
    `List<String> list = new ArrayList<>();`,
  ],
  csharp: [
    `public class Program { static void Main() {} }`,
    `var x = 10;`,
    `for(int i=0;i<10;i++){}`,
    `if(x=5){}`,
    `List<string> list = new List<string>();`,
  ],
  go: [
    `func main() {}`,
    `var x int = 10`,
    `for i := 0; i < 10; i++ {}`,
    `if x := 5; x == 5 {}`,
    `make([]int, 0)`,
  ],
  rust: [
    `fn main() {}`,
    `let mut x = 10;`,
    `for i in 0..10 {}`,
    `if x = 5 {}`,
    `let mut vec = Vec::new();`,
  ],
  ruby: [
    `def add(a,b); a + b; end`,
    `x = 10`,
    `10.times { |i| puts i }`,
    `if x = 5 then puts 'yes' end`,
    `arr = []`,
  ],
  php: [
    `<?php function add($a,$b){return $a+$b;} ?>`,
    `$x = 10;`,
    `for($i=0;$i<10;$i++){}`,
    `if($x=5){}`,
    `$arr = [];`,
  ],
  swift: [
    `func add(a: Int, b: Int) -> Int { return a + b }`,
    `var x = 10`,
    `for i in 0..<10 {}`,
    `if x = 5 {}`,
    `var arr: [Int] = []`,
  ],
  kotlin: [
    `fun add(a: Int, b: Int): Int = a + b`,
    `var x = 10`,
    `for (i in 0..10) {}`,
    `if (x = 5) {}`,
    `val list = mutableListOf<Int>()`,
  ],
  sql: [
    `SELECT * FROM users`,
    `SELECT * FROM users WHERE id=1`,
    `INSERT INTO users VALUES(1,'test')`,
    `UPDATE users SET name='test'`,
    `DELETE FROM users`,
  ],
  html: [
    `<div><p>Hello</p></div>`,
    `<img src="test.jpg">`,
    `<br>`,
    `<div class="test">`,
    `<a href="http://test">Link</a>`,
  ],
  css: [
    `.test { color: red; }`,
    `#test { font-size: 10px; }`,
    `div { margin: 0; }`,
    `.test { padding: 10px; }`,
    `* { margin: 0; padding: 0; }`,
  ],
};

const roastSummaries = [
  "Este código é tão ruim que até o compilador está chorando.",
  "Se isso fosse uma receita, seria uma de bolo podre.",
  "Parabéns, você criou um monstro de spaghetti code.",
  "Esse código tem mais buracos que um queijo suíço.",
  "Minha avó programa melhor com um Fortran de 1970.",
  "Isso funciona? Surpreendentemente sim. Mas por quanto tempo?",
  "Eu já vi código melhor em tutoriais do YouTube de 2008.",
  "Este código é a definição de 'funciona na minha máquina'.",
  "Você sabe que existem funções, certo?",
  "Esse negócio tem mais IFs que um relacionamento romântico.",
  "POG em estado puro - Programação Orientada a Gambiarras.",
  "Isso não é código, é uma obra de arte moderna (do tipo que não se entende).",
  "Menos isca de troll, mais qualidade por favor.",
  "Este código é tão ilegível que preciso de intérprete.",
  "Sofri aqui só de olhar. Sério, dói ver isso.",
];

const roastComments = [
  "Isso é o que acontece quando se programa às 3 da manhã.",
  "Por que não usar o nome correto? Para dificultar a vida?",
  "Performance? O que é isso?",
  "Segurança? Isso é uma piada?",
  "Boas práticas são para quem tem medo de viver perigosamente.",
  "Isso vai dar problema em produção, pode crer.",
  "Código assim merece um Prêmio Pior do Ano.",
  "Eu chorei. De rir. De tristeza. Das duas formas.",
  "Isso é o que acontece quando LinkedIn vira fonte de tutorial.",
  "Você sabe que existe CTRL+C e CTRL+V, né?",
  "Meu deus, isso é worse than spaghetti code.",
  "Mais fácil ler hieróglifo egípcio do que isso.",
  "Se o código fosse um personagem, seria o vilão do filme.",
  "Isso não compila, compadece.",
  "Parabéns, você criou um bug features.",
];

const explanations = [
  "Use nomes descritivos para variáveis.",
  "Adicione tratamento de erros adequado.",
  "Evite atribuição em condicionais.",
  "Use funções auxiliares para código reutilizável.",
  "Adicione validação de entrada.",
  "Use tipagem adequada.",
  "Evite código duplicado.",
  "Mantenha as funções pequenas e focadas.",
  "Adicione comentários quando necessário.",
  "Siga as convenções de código da linguagem.",
];

const issueDescriptions = [
  "Nome de variável não descritivo",
  "Função muito longa",
  "Falta de tratamento de erros",
  "Atribuição em conditional",
  "Código duplicado",
  "Falta de validação de entrada",
  "Variável não utilizada",
  "Magic numbers no código",
  "Falta de tipagem",
  "Nomes confusos",
  "Comentários desnecessários ou ausentes",
  "Performance ruim em loop",
  "Vazamento de memória potencial",
  "SQL injection vulnerável",
  "XSS vulnerável",
  "Código muito complexo",
  "Falta de lazy loading",
  "Ausência de índice em banco",
  "Boas práticas não seguidas",
  "Estilo inconsistente",
];

function generateIssue(analysisId: string) {
  const severity = faker.helpers.arrayElement(severities);
  const issueType = faker.helpers.arrayElement(issueTypes);
  const description = faker.helpers.arrayElement(issueDescriptions);
  const line = faker.number.int({ min: 1, max: 100 });
  const column = faker.number.int({ min: 1, max: 50 });

  return {
    analysisId,
    severity,
    issueType,
    line,
    column,
    description,
    roastComment: faker.helpers.arrayElement(roastComments),
  };
}

function generateDiff(issueId: string) {
  const templates = [
    { original: "x = 10", fixed: "const x = 10" },
    { original: "var x = 10", fixed: "let x = 10" },
    {
      original: "function add(a,b){return a+b}",
      fixed: "function add(a: number, b: number): number { return a + b; }",
    },
    { original: "if(x=5)", fixed: "if(x === 5)" },
    {
      original: "SELECT * FROM users",
      fixed: "SELECT id, name, email FROM users WHERE id = $1",
    },
    {
      original: '<img src="test.jpg">',
      fixed: '<img src="test.jpg" alt="Description" loading="lazy">',
    },
    {
      original: ".test { color: red; }",
      fixed: ".test { color: var(--color-primary); }",
    },
    {
      original: "def add(a,b):return a+b",
      fixed:
        'def add(a: int, b: int) -> int:\n    """Add two numbers."""\n    return a + b',
    },
  ];

  const template = faker.helpers.arrayElement(templates);

  return {
    issueId,
    originalCode: template.original,
    fixedCode: template.fixed,
    explanation: faker.helpers.arrayElement(explanations),
  };
}

async function seed() {
  console.log("🌱 Starting seed...");

  console.log("Creating submissions and analyses...");

  for (let i = 0; i < 100; i++) {
    const language = faker.helpers.arrayElement(languages);
    const code = faker.helpers.arrayElement(codeTemplates[language]);

    const roastMode = faker.datatype.boolean();
    const score = faker.number.int({ min: 0, max: 10 });

    const [submission] = await db
      .insert(submissions)
      .values({
        code,
        language,
        roastMode,
        score,
      })
      .returning();

    const [analysis] = await db
      .insert(analyses)
      .values({
        submissionId: submission.id,
        roastSummary: faker.helpers.arrayElement(roastSummaries),
      })
      .returning();

    const issueCount = faker.number.int({ min: 3, max: 8 });
    const createdIssues = [];

    for (let j = 0; j < issueCount; j++) {
      const [issue] = await db
        .insert(issues)
        .values(generateIssue(analysis.id))
        .returning();

      createdIssues.push(issue);
    }

    for (const issue of createdIssues) {
      await db.insert(diffs).values(generateDiff(issue.id)).returning();
    }

    if ((i + 1) % 10 === 0) {
      console.log(`  Created ${i + 1}/100 submissions`);
    }
  }

  console.log(
    "✅ Seed completed! Created 100 submissions with analyses, issues, and diffs.",
  );
  console.log("");
  console.log('Run "pnpm db:studio" to explore the database.');
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
