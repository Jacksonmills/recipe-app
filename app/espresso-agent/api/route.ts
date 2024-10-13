import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, tool } from "ai";
import { z } from "zod";
import { espressoShotSchema } from "../schema";

const modelName = "gpt-4o-2024-08-06";

export async function POST(req: Request) {
  // Parse the request body to extract messages
  const { messages } = await req.json();

  // Use the streamText function to generate a response using the OpenAI model
  const result = await streamText({
    model: openai(modelName),
    messages: convertToCoreMessages(messages),
    system:
      "You are an expert in espresso calibration, utilizing both practical brewing experience and insights from mathematical models to fine-tune espresso shots. " +
      "Assess the interaction between grind size, flow rate, and extraction yield using established mathematical relationships. Provide specific, step-by-step adjustments that will help a barista move towards a consistent and optimal espresso shot. " +
      "Take into account the grind size, grind weight, extraction time, yield, flow resistance, beverage concentration, and other shot settings. " +
      "Offer specific advice, like 'coarsen the grind slightly to reduce extraction time', or 'adjust the dose to achieve a better balance'.",
    tools: {
      // Tool to evaluate espresso shot settings and provide feedback
      evaluateShot: tool({
        description:
          "A tool for evaluating espresso shot settings. " +
          "Provides guidance based on grind size, grind weight, shot time, yield, flow rate, resistance, and concentration to assist in optimizing espresso shots.",
        parameters: espressoShotSchema,
        execute: async ({
          grindSize,
          grindWeight,
          shotTime,
          shotWeight,
          notes,
        }) => {
          // Calculate flow rate: yield divided by shot time
          const flowRate = shotWeight / shotTime;
          // Calculate flow resistance: grind weight divided by shot time
          const resistance = grindWeight / shotTime;
          // Calculate concentration: shot weight divided by grind weight
          const concentration = shotWeight / grindWeight;

          // Create a base feedback message with calculated values
          let feedback = `Given the grind size '${grindSize}', weight of ${grindWeight}g, shot time of ${shotTime}s, and yield of ${shotWeight}g, `;
          feedback += `the calculated flow rate is ${flowRate.toFixed(
            2
          )}g/s, the resistance is ${resistance.toFixed(
            2
          )}g/s, and the concentration is ${concentration.toFixed(2)}.`;

          // Provide specific recommendations based on flow rate
          if (flowRate < 1) {
            feedback +=
              " The flow rate is quite low, suggesting that the grind might be too fine or the dose too high. Consider coarsening the grind slightly.";
          } else if (flowRate > 3) {
            feedback +=
              " The flow rate is too high, which might indicate that the grind is too coarse. Consider tightening the grind to slow down the flow.";
          }

          // Provide specific recommendations based on concentration
          if (concentration < 1) {
            feedback +=
              " The concentration is low, which may lead to a weak-tasting espresso. Consider increasing the grind weight or reducing the shot yield.";
          } else if (concentration > 2) {
            feedback +=
              " The concentration is high, which may result in an overly strong or bitter shot. Consider reducing the grind weight or increasing the shot yield.";
          }

          // Append any additional notes provided
          if (notes) {
            feedback += ` Additional notes: ${notes}`;
          }

          // Return the final feedback
          return { feedback };
        },
      }),
      // Tool for providing a final recommendation after analysis
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
      // Tool to calculate the flow rate of an espresso shot
      flowRateCalculator: tool({
        description:
          "Calculates the flow rate of the espresso shot based on shotWeight and extraction time.",
        parameters: z.object({
          shotWeight: z.number(),
          time: z.number(),
        }),
        execute: async ({ shotWeight, time }) => {
          // Flow rate is calculated by dividing shotWeight by time
          const flowRate = shotWeight / time;
          return { flowRate: flowRate.toFixed(2) };
        },
      }),
      // Tool to evaluate extraction efficiency based on TDS and yield
      extractionEfficiencyEvaluator: tool({
        description:
          "Evaluates the efficiency of extraction using Total Dissolved Solids (TDS) and shotWeight.",
        parameters: z.object({
          tds: z.number(),
          shotWeight: z.number(),
        }),
        execute: async ({ tds, shotWeight }) => {
          // Extraction shotWeight is calculated as (TDS * shotWeight) / 100
          const extractionYield = (tds * shotWeight) / 100;
          return { extractionYield: extractionYield.toFixed(2) };
        },
      }),
      // Tool to analyze flow resistance of the coffee puck
      flowResistanceAnalyzer: tool({
        description:
          "Analyzes the flow resistance of the coffee puck to determine if adjustments are needed in tamping pressure or grind consistency.",
        parameters: z.object({
          grindWeight: z.number(),
          shotTime: z.number(),
        }),
        execute: async ({ grindWeight, shotTime }) => {
          // Flow resistance is calculated by dividing grind weight by shot time
          const resistance = grindWeight / shotTime;
          return { resistance: resistance.toFixed(2) };
        },
      }),
      // Tool to analyze the concentration of the espresso shot
      concentrationAnalyzer: tool({
        description:
          "Analyzes the concentration of the espresso shot by comparing shot weight and grind weight.",
        parameters: z.object({
          shotWeight: z.number(),
          grindWeight: z.number(),
        }),
        execute: async ({ shotWeight, grindWeight }) => {
          // Concentration is calculated by dividing shot weight by grind weight
          const concentration = shotWeight / grindWeight;
          return { concentration: concentration.toFixed(2) };
        },
      }),
    },
  });

  // Return the result as a data stream response
  return result.toDataStreamResponse();
}
