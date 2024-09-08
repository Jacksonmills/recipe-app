'use client'

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { experimental_useObject as useObject } from "ai/react";
import { RecipeSchema } from "@/lib/recipe-schema";
import { Loading } from "@/components/loading";
import { RecipeCard } from "@/components/recipe-card";

export default function VercelAiPage() {
  const [prompt, setPrompt] = useState("A succulent orange chicken.");
  const { object, submit, isLoading } = useObject({
    schema: RecipeSchema,
    api: "/vercel-ai/api",
    initialValue: {name: "", ingredients: [], steps: []},
  });

  const handleSubmit = () => {
    submit({prompt});
    setPrompt("");
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
      <RecipeCard recipe={object} />
    </div>
  )
}