import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import * as mathjs from "mathjs";
import { z } from "zod";

const modelName = "gpt-4o-2024-08-06";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai(modelName),
    messages: convertToCoreMessages(messages),
    system:
      "You are solving math problems. " +
      "Reason step by step. " +
      "Use the calculator when necessary. " +
      "The calculator can only do simple additions, subtractions, multiplications, and divisions. " +
      "When you give the final answer, provide an explanation for how you got it using the 'answer' tool.",
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
  });

  return result.toDataStreamResponse();
}
