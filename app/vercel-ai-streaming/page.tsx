"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { Input } from "@/components/ui/input";
import { RecipeCard } from "@/components/recipe-card";

import { Loading } from "@/components/loading";
import { RecipeSchema } from "@/lib/recipe-schema";

export default function VercelAiPage() {
  const [prompt, setPrompt] = useState("A succulent orange chicken.");
  const { object, submit, isLoading } = useObject({
    schema: RecipeSchema,
    api: "/vercel-ai-streaming/api",
  });

  console.log(object)

  return (
    <div className="flex flex-col gap-4">
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
      {isLoading && <Loading />}
      {object && <RecipeCard recipe={object as never} />}
    </div>
  );
}