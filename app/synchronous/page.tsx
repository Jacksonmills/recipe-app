'use client';

import { Loading } from '@/components/loading';
import { RecipeCard } from '@/components/recipe-card';
import { Input } from '@/components/ui/input';
import type { RecipeSchema } from '@/lib/recipe-schema';
import { useState } from 'react';
import type { z } from 'zod';

export default function SynchronousPage() {
  const [prompt, setPrompt] = useState('A succulent orange chicken.');
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<z.infer<typeof RecipeSchema>>();

  const handleSubmit = async () => {
    setPrompt('');
    setIsLoading(true);
    setRecipe(undefined);

    const data = await fetch('/synchronous/api', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    setIsLoading(false);
    setRecipe(await data.json());
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={prompt}
        disabled={isLoading}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Enter a prompt..."
      />
      {isLoading && <Loading />}
      <RecipeCard recipe={recipe} />
    </div>
  );
}
