import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import { z } from "zod";
import { espressoShotSchema } from "../schema";

const modelName = "gpt-4o-2024-08-06";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai(modelName),
    messages: convertToCoreMessages(messages),
    system:
      "You are an expert in espresso calibration, helping baristas fine-tune their espresso shots. " +
      "Review the provided settings and offer detailed, step-by-step guidance on what to adjust to achieve an optimal espresso shot. " +
      "Take into account the grind size, grind weight, extraction time, yield, and other shot settings. " +
      "Consider how these variables interact and provide thoughtful explanations to guide the barista toward the perfect shot. " +
      "Offer specific advice, like 'coarsen the grind slightly to reduce extraction time', or 'adjust the dose to achieve a better balance'.",
    tools: {
      evaluateShot: tool({
        description:
          "A tool for evaluating espresso shot settings. " +
          "Provides guidance based on grind size, grind weight, shot time, yield, etc. to assist in optimizing espresso shots.",
        parameters: espressoShotSchema,
        execute: async ({
          grindSize,
          grindWeight,
          shotTime,
          shotWeight,
          notes,
        }) => {
          // Here we would use some logic or model to assess the parameters and suggest tweaks.
          const feedback = `Given the grind size '${grindSize}', weight of ${grindWeight}g, shot time of ${shotTime}s, and yield of ${shotWeight}g, I recommend slightly adjusting the grind size to fine-tune extraction. If the shot tastes bitter, consider coarsening the grind or reducing the dose slightly. ${
            notes ? notes : ""
          }`;
          return { feedback };
        },
      }),
      answer: tool({
        description: "A tool for providing the final recommendation.",
        parameters: z.object({
          suggestions: z.array(
            z.object({
              setting: z.string(),
              recommendation: z.string(),
            })
          ),
          finalAdvice: z.string(),
        }),
        execute: async ({ suggestions, finalAdvice }) => ({
          suggestions,
          finalAdvice,
        }),
      }),
    },
  });

  return result.toDataStreamResponse();
}
