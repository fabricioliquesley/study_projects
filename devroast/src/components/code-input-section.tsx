"use client";

import { useEffect, useState } from "react";
import {
  CodeEditorHighlight,
  detectLanguage,
  type Language,
} from "@/components/code-editor-highlight";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { MAX_CHARS } from "@/constants";

function CodeInputSection() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);
  const [language, setLanguage] = useState<Language>("javascript");

  const isEmpty = code.trim() === "";
  const isOverLimit = code.length > MAX_CHARS;

  useEffect(() => {
    if (code.trim()) {
      const detected = detectLanguage(code);
      setLanguage(detected);
    }
  }, [code]);

  return (
    <div className="flex w-[960px] flex-col gap-4">
      <CodeEditorHighlight
        value={code}
        onChange={setCode}
        language={language}
        onLanguageChange={setLanguage}
        showHeader
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Toggle
              checked={roastMode}
              onCheckedChange={(checked) => setRoastMode(checked)}
            />
            <span className="font-mono text-[13px] text-accent-green">
              roast mode
            </span>
          </div>
          <span className="font-mono text-xs text-text-tertiary" />
        </div>
        <Button variant="primary" size="lg" disabled={isEmpty || isOverLimit}>
          <span className="text-[#0a0a0a]">$ roast_my_code</span>
        </Button>
      </div>
    </div>
  );
}

export { CodeInputSection };
