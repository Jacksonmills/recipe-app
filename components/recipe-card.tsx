import type { z } from "zod";
import Markdown from "react-markdown";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecipeSchema } from "@/lib/recipe-schema";
import type { DeepPartial } from "ai";

export function RecipeCard({
  recipe,
}: { recipe?: DeepPartial<z.infer<typeof RecipeSchema>> }) {
  if (!recipe) return null;

  return (
    <Card className="w-full mx-auto max-w-7xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((ingredient, index) => {
                if (!ingredient) return null;

                return (
                  <li key={`${ingredient.ingredient}-${index}`}>
                    {ingredient.quantity} {ingredient.ingredient}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {recipe.steps && recipe.steps.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Steps</h3>
            <ol className="list-inside space-y-2">
              {recipe.steps.map((step, index) => {
                const key = `${step}-${index}`;

                return (
                  <li key={key}>
                    <Markdown>{step}</Markdown>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
