import { RecipeSchema } from '@/lib/recipe-schema';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';

const modelName = 'gpt-4o-2024-08-06';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const { object } = await generateObject({
    model: openai(modelName),
    schema: RecipeSchema,
    prompt: `Recipe for ${prompt || 'a succulent orange chicken'}:`,
  });

  return NextResponse.json(object);
}
