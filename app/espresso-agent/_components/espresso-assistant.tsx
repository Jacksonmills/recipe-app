"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import type { EspressoShot } from "../schema";
import Markdown from "react-markdown";
import useAutoScroll from "../_hooks/use-auto-scroll";
import EspressoShotForm from "./espresso-shot-form";
import { cn } from "@/lib/utils";

export default function EspressoAssistant() {
  const [formData, setFormData] = useState<EspressoShot>({
    grindSize: 2.0,
    grindWeight: 18.0,
    grindTime: 15.0,
    shotTime: 0,
    shotWeight: 25.0,
    notes: "",
  });
  const [step, setStep] = useState<"setup" | "brewing" | "weighing">("setup");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    api: "/espresso-agent/api",
    maxSteps: 10,
  });

  const endRef = useRef<HTMLDivElement>(null);
  useAutoScroll(endRef, [messages]);

  const handleKnobChange = (name: keyof EspressoShot, value: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Set input when knob changes
    setInput(createInputString({ ...formData, [name]: value }));
  };

  const handleStartBrewing = () => {
    setStep("brewing");
    setStartTime(Date.now());

    // Set input when brewing starts
    setInput(createInputString(formData));
  };

  const handleStopBrewing = () => {
    if (startTime) {
      const brewTime = (Date.now() - startTime) / 1000;
      setFormData(prev => ({ ...prev, shotTime: brewTime }));
      setElapsedTime(brewTime);
      setStep("weighing");

      // Set input when brewing stops
      setInput(createInputString({ ...formData, shotTime: brewTime }));
    }
  };

  const resetForm = () => {
    setFormData({
      grindSize: 2.0,
      grindWeight: 18.0,
      grindTime: 15.0,
      shotTime: 0,
      shotWeight: 25.0,
      notes: "",
    });
    setStep("setup");
    setStartTime(null);
    setElapsedTime(0);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (step === "brewing" && startTime) {
      intervalId = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [step, startTime]);

  // Helper function to create the input string
  const createInputString = ({
    grindSize,
    grindWeight,
    grindTime,
    shotTime,
    shotWeight,
    notes,
  }: EspressoShot): string => {
    return `Grind Size: ${grindSize.toFixed(
      1
    )} Dose Weight: ${grindWeight.toFixed(1)}g Grind Time: ${grindTime.toFixed(
      1
    )}s Shot Time: ${shotTime.toFixed(1)}s Shot Weight: ${shotWeight.toFixed(
      1
    )}g ${notes ? `Notes: ${notes}` : ""}`;
  };

  return (
    <div className="flex flex-col h-screen bg-background relative">
      <div className="flex-1 overflow-hidden grid [&>*]:col-start-1  [&>*]:row-start-1">
        <ScrollArea className="h-full px-4">
          <>
            {messages.map((m, idx) => (
              <div
                key={m.id}
                className={cn(
                  "mb-4 whitespace-pre-wrap",
                  // if first message, add top margin to separate from top, else add bottom margin to separate from next message
                  idx === 0 ? "mt-4" : ""
                )}
              >
                {m.role === "user" ? (
                  <div className="text-right">
                    <div className="inline-block p-4 bg-accent text-card-foreground">
                      <strong>{m.content}</strong>
                    </div>
                  </div>
                ) : (
                  <div>
                    {m.content ? (
                      <Markdown className="p-4">{m.content}</Markdown>
                    ) : null}

                    {m.toolInvocations
                      ? m.toolInvocations.map((t, i) => {
                          if (
                            t.toolName === "evaluateShot" &&
                            t.state === "result"
                          ) {
                            return (
                              <Card
                                key={t.toolCallId}
                                className="p-4 mt-2 rounded-none"
                              >
                                <h3 className="font-bold">Shot Evaluation</h3>
                                <p>{t.result.feedback}</p>
                              </Card>
                            );
                          }
                          if (t.toolName === "answer") {
                            return (
                              <Card
                                key={t.toolCallId}
                                className="p-4 mt-2 rounded-none"
                              >
                                <h3 className="font-bold">Recommendations</h3>
                                {t.args.suggestions.map(
                                  (
                                    suggestion: {
                                      setting: string;
                                      recommendation: string;
                                    },
                                    index: number
                                  ) => {
                                    return (
                                      <p key={`${t.toolCallId}-${index}`}>
                                        <strong>{suggestion.setting}:</strong>{" "}
                                        {suggestion.recommendation}
                                      </p>
                                    );
                                  }
                                )}
                                <p className="mt-2">
                                  <strong>Final Advice:</strong>{" "}
                                  {t.args.finalAdvice}
                                </p>
                              </Card>
                            );
                          }
                        })
                      : null}

                    <div className="flex flex-col md:flex-row gap-2 [&>*]:grow">
                      {m.toolInvocations
                        ? m.toolInvocations.map((t, i) => {
                            if (
                              t.toolName === "flowRateCalculator" &&
                              t.state === "result"
                            ) {
                              return (
                                <Card
                                  key={t.toolCallId}
                                  className="p-4 mt-2 rounded-none"
                                >
                                  <h3 className="font-bold">
                                    Flow Rate Calculation
                                  </h3>
                                  <p>Flow Rate: {t.result.flowRate} g/s</p>
                                </Card>
                              );
                            }
                            if (
                              t.toolName === "extractionEfficiencyEvaluator" &&
                              t.state === "result"
                            ) {
                              return (
                                <Card
                                  key={t.toolCallId}
                                  className="p-4 mt-2 rounded-none"
                                >
                                  <h3 className="font-bold">
                                    Extraction Efficiency
                                  </h3>
                                  <p>
                                    Extraction Yield: {t.result.extractionYield}
                                    %
                                  </p>
                                </Card>
                              );
                            }
                            if (
                              t.toolName === "flowResistanceAnalyzer" &&
                              t.state === "result"
                            ) {
                              return (
                                <Card
                                  key={t.toolCallId}
                                  className="p-4 mt-2 rounded-none"
                                >
                                  <h3 className="font-bold">
                                    Flow Resistance Analysis
                                  </h3>
                                  <p>Resistance: {t.result.resistance} g/s</p>
                                </Card>
                              );
                            }
                            if (
                              t.toolName === "concentrationAnalyzer" &&
                              t.state === "result"
                            ) {
                              return (
                                <Card
                                  key={t.toolCallId}
                                  className="p-4 mt-2 rounded-none"
                                >
                                  <h3 className="font-bold">
                                    Concentration Analysis
                                  </h3>
                                  <p>Concentration: {t.result.concentration}</p>
                                </Card>
                              );
                            }
                          })
                        : null}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div ref={endRef} className="h-12" />
          </>
        </ScrollArea>

        <div className="bg-gradient-to-t to-10% from-background/75 to-transparent pointer-events-none z-20 h-full" />
      </div>

      <EspressoShotForm
        formData={formData}
        step={step}
        elapsedTime={elapsedTime}
        handleKnobChange={handleKnobChange}
        handleStartBrewing={handleStartBrewing}
        handleStopBrewing={handleStopBrewing}
        resetForm={resetForm}
        isLoading={isLoading}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
