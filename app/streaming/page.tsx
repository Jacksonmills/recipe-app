'use client'

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { RecipeSchema } from "@/lib/recipe-schema";
import { Loading } from "@/components/loading";
import { RecipeCard } from "@/components/recipe-card";
import { z } from "zod";
import { parse } from "partial-json";

export default function StreamingPage() {
  const [prompt, setPrompt] = useState("A succulent orange chicken.");
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<z.infer<typeof RecipeSchema>>();

  const handleSubmit = async () => {
    setPrompt("");
    setIsLoading(true);
    setRecipe(undefined);

    const data = await fetch("/streaming/api", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const reader = data.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let result = "";
    let parsed = {};
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value);
      parsed = parse(result)
      setRecipe(parsed as z.infer<typeof RecipeSchema>);
    }

    setIsLoading(false);
  };
  
  return (
    <div className="flex flex-col gap-4">
      <Input
        value={prompt}
        disabled={isLoading}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Enter a prompt..."
      />
      {isLoading && <Loading />}
      <RecipeCard recipe={recipe} />
    </div>
  )
}