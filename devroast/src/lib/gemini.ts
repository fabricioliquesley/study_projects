import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

export type RoastIssue = {
  severity: "critical" | "warning" | "good";
  issueType: string;
  line: number;
  description: string;
  roastComment: string;
  diff: {
    originalCode: string;
    fixedCode: string;
    explanation: string;
  } | null;
};

export type RoastResult = {
  roastSummary: string;
  score: number;
  issues: RoastIssue[];
};

const BRUTALLY_HONEST_PROMPT = `You are a technical code reviewer. Analyze the following code and provide a constructive, objective critique.

For each issue found, provide:
- severity: "critical" | "warning" | "good"
- issueType: specific technical issue category
- line: line number where issue occurs
- description: technical explanation of the problem
- roastComment: a brief honest comment about the issue

Return your response as a JSON object with this structure:
{
  "roastSummary": "Brief summary of the code quality (1-2 sentences)",
  "score": 1-10 rating,
  "issues": [
    {
      "severity": "critical" | "warning" | "good",
      "issueType": "string",
      "line": number,
      "description": "string",
      "roastComment": "string",
      "diff": {
        "originalCode": "string",
        "fixedCode": "string",
        "explanation": "string"
      } | null
    }
  ]
}

Code to analyze:
{language}
---
{code}`;

const FULL_ROAST_PROMPT = `You are a sarcastic, humorous code reviewer who roasts bad code. Be critical but funny. Use expressions like "POG em estado puro" (Programação Orientada a Gambiarras), "isso vai dar problema", "quem escreveu isso precisa de ajuda".

For each issue found, provide:
- severity: "critical" | "warning" | "good"
- issueType: specific technical issue category
- line: line number where issue occurs
- description: technical explanation of the problem
- roastComment: a sarcastic, humorous roast comment

Return your response as a JSON object with this structure:
{
  "roastSummary": "Brief sarcastic summary of the code quality",
  "score": 1-10 rating (1 = worst, most roasted code),
  "issues": [
    {
      "severity": "critical" | "warning" | "good",
      "issueType": "string",
      "line": number,
      "description": "string",
      "roastComment": "sarcastic humorous comment",
      "diff": {
        "originalCode": "string",
        "fixedCode": "string",
        "explanation": "string"
      } | null
    }
  ]
}

Code to analyze:
{language}
---
{code}`;

export async function analyzeCode(
  code: string,
  language: string,
  roastMode: boolean,
): Promise<RoastResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = roastMode ? FULL_ROAST_PROMPT : BRUTALLY_HONEST_PROMPT;
  const finalPrompt = prompt
    .replace("{language}", language)
    .replace("{code}", code);

  const result = await model.generateContent(finalPrompt);
  const response = result.response.text();

  const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) ||
    response.match(/```\n?([\s\S]*?)\n?```/) || [null, response];

  const jsonStr = jsonMatch[1] || response;
  const parsed = JSON.parse(jsonStr.trim());

  return {
    roastSummary: parsed.roastSummary,
    score: parsed.score,
    issues: parsed.issues || [],
  };
}
