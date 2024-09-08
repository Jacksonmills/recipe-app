"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { Input } from "@/components/ui/input";
import { RecipeCard } from "@/components/recipe-card";

import { RecipeSchema } from "@/lib/recipe-schema";
import { Loader } from "lucide-react";

export default function VercelAiPage() {
  const [prompt, setPrompt] = useState("A succulent orange chicken.");
  const { object, submit, isLoading } = useObject({
    schema: RecipeSchema,
    api: "/vercel-ai-streaming/api",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
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
        <div className="absolute right-2 top-1/2 -translate-y-1/2" >
          {isLoading && <Loader className="animate-spin-slow" />}
        </div>
      </div>
      <RecipeCard recipe={object} />
    </div>
  );
}