"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CodeEditorHighlight,
  detectLanguage,
  type Language,
} from "@/components/code-editor-highlight";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { MAX_CHARS } from "@/constants";
import { trpc } from "@/trpc/react";

const RATE_LIMIT_MS = 10000;

function CodeInputSection() {
  const [code, setCode] = useState("");
  const [roastMode, setRoastMode] = useState(true);
  const [language, setLanguage] = useState<Language>("javascript");
  const [lastSubmission, setLastSubmission] = useState<number>(0);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const router = useRouter();

  const createSubmission = trpc.submission.create.useMutation({
    onSuccess: (data) => {
      setLastSubmission(Date.now());
      router.push(`/roast/${data.id}`);
    },
  });

  const isPending = createSubmission.isPending;
  const now = Date.now();
  const isOnCooldown = now - lastSubmission < RATE_LIMIT_MS;

  const isEmpty = code.trim() === "";
  const isOverLimit = code.length > MAX_CHARS;

  useEffect(() => {
    if (lastSubmission === 0) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        RATE_LIMIT_MS - (Date.now() - lastSubmission),
      );
      setCooldownRemaining(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [lastSubmission]);

  useEffect(() => {
    if (code.trim()) {
      const detected = detectLanguage(code);
      setLanguage(detected);
    }
  }, [code]);

  const canSubmit = !isEmpty && !isOverLimit && !isPending && !isOnCooldown;

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
        <Button
          variant="primary"
          size="lg"
          disabled={!canSubmit}
          onClick={() => {
            if (!canSubmit) return;
            createSubmission.mutate({
              code: code.trim(),
              language: language,
              roastMode,
            });
          }}
        >
          {isPending ? (
            "loading..."
          ) : isOnCooldown ? (
            <span className="text-[#0a0a0a]">
              wait {Math.ceil(cooldownRemaining / 1000)}s
            </span>
          ) : (
            <span className="text-[#0a0a0a]">$ roast_my_code</span>
          )}
        </Button>
      </div>
    </div>
  );
}

export { CodeInputSection };
