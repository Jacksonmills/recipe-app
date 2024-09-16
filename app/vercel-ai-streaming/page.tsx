"use client";

import { RecipeCard } from "@/components/recipe-card";
import { Input } from "@/components/ui/input";
import { experimental_useObject as useObject } from "ai/react";
import { useState } from "react";

import { RecipeSchema } from "@/lib/recipe-schema";
import { Loader } from "lucide-react";

export default function VercelAiStreamingPage() {
  const [prompt, setPrompt] = useState("A succulent orange chicken.");
  const { object, submit, isLoading } = useObject({
    schema: RecipeSchema,
    api: "/vercel-ai-streaming/api",
  });

  return (
    <>
      <div className="grow min-h-full">
        <RecipeCard recipe={object} />
      </div>
      <div className="sticky bottom-0 left-0">
        <div className="relative w-[calc(100%_+_16px)] -ml-2 bg-background p-2">
          <Input
            value={prompt}
            disabled={isLoading}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submit({ prompt });
                setPrompt("");
              }
            }}
            placeholder="What recipe do you want?"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {isLoading && <Loader className="animate-spin-slow" />}
          </div>
        </div>
      </div>
    </>
  );
}
