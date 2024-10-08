import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import * as mathjs from "mathjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const modelName = "gpt-4o-2024-08-06";

export async function POST() {
  console.log("POST /vercel-ai-agents/api/route.ts");
  const result = await generateText({
    model: openai(modelName, {
      structuredOutputs: true,
    }),
    tools: {
      calculate: tool({
        description:
          "A tool for evaluating mathematical expressions. " +
          "Example expressions: " +
          "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
        parameters: z.object({ expression: z.string() }),
        execute: async ({ expression }) => ({
          expression,
          result: mathjs.evaluate(expression),
        }),
      }),
      answer: tool({
        description: "A tool for providing the final answer.",
        parameters: z.object({
          steps: z.array(
            z.object({
              calculation: z.string(),
              reasoning: z.string(),
            })
          ),
          answer: z.string(),
        }),
        // no execute function - invoking it will terminate the agent
      }),
    },
    maxSteps: 10,
    system:
      "You are solving math problems. " +
      "Reason step by step. " +
      "Use the calculator when necessary. " +
      "The calculator can only do simple additions, subtractions, multiplications, and divisions. " +
      "When you give the final answer, provide an explanation for how you got it using the 'answer' tool.",
    prompt:
      "A taxi driver earns $9461 per 1-hour work. " +
      "If he works 12 hours a day and in 1 hour he uses 14-liters petrol with price $134 for 1-liter. " +
      "How much money does he earn in one day?",
  });

  console.log(result);

  return new NextResponse(result.text);
}
