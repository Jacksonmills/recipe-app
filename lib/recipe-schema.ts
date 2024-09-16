import { z } from "zod";

export const RecipeSchema = z.object({
  name: z.string().describe("The name of the recipe"),
  ingredients: z.array(
    z
      .object({
        quantity: z.string().describe("The quantity of the ingredient"),
        ingredient: z.string().describe("The name of the ingredient"),
      })
      .describe("The list of ingredients"),
  ),
  steps: z
    .array(z.string().describe("The markdown content of the step"))
    .describe("The list of steps"),
});
