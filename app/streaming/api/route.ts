import { RecipeSchema } from "@/lib/recipe-schema";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

const modelName = "gpt-4o-2024-08-06";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const client = new OpenAI();

  const response = await client.chat.completions.create({
    model: modelName,
    messages: [{ role: "user", content: `Recipe for ${prompt || "a succulent orange chicken"}:` }],
    response_format: zodResponseFormat(RecipeSchema, 'recipeSchema'),
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const content = chunk.choices[0].delta.content || '';
        controller.enqueue(new TextEncoder().encode(content));
      }
      controller.close();
    }
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    }
  });
};