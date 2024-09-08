import { z } from "zod";
import Markdown from "react-markdown";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RecipeSchema } from "@/lib/recipe-schema";

export function RecipeCard({ recipe }: { recipe?: z.infer<typeof RecipeSchema> }) {
  if (!recipe) return null;
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
      <CardTitle className="text-2xl font-bold">{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={`${ingredient.ingredient}-${index}`}>
                  {ingredient.quantity} {ingredient.ingredient}
                </li>
              ))}
            </ul>
          </div>
        )}
        {recipe.steps && recipe.steps.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Steps</h3>
            <ol className="list-inside space-y-2">
              {recipe.steps.map((step, index) => (
                <li key={`${step}-${index}`}>
                  <Markdown>{step}</Markdown>
                </li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  )
}