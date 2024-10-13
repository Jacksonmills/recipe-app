"use client";

import { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { IterationCw, Loader, Sparkle } from "lucide-react";
import { Knob } from "./knob";
import type { EspressoShot } from "../schema";
import Markdown from "react-markdown";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

  const handleKnobChange = (name: keyof EspressoShot, value: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartBrewing = () => {
    setStep("brewing");
    setStartTime(Date.now());
  };

  const handleStopBrewing = () => {
    if (startTime) {
      const brewTime = (Date.now() - startTime) / 1000;
      setFormData(prev => ({ ...prev, shotTime: brewTime }));
      setElapsedTime(brewTime);
      setStep("weighing");
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

  useEffect(() => {
    const handleSetInput = ({
      grindSize,
      grindWeight,
      grindTime,
      shotTime,
      shotWeight,
      notes,
    }: EspressoShot): string => {
      return `Grind Size: ${grindSize.toFixed(
        1
      )} Dose Weight: ${grindWeight.toFixed(
        1
      )}g Grind Time: ${grindTime.toFixed(1)}s Shot Time: ${shotTime.toFixed(
        1
      )}s Shot Weight: ${shotWeight.toFixed(1)}g ${
        notes ? `Notes: ${notes}` : ""
      }`;
    };

    setInput(handleSetInput(formData));
  }, [formData, setInput]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <>
            {messages.map(m => (
              <div key={m.id} className="mb-4 whitespace-pre-wrap">
                {m.role === "user" ? (
                  <div className="text-right">
                    <div className="inline-block p-4 rounded-lg bg-accent text-card-foreground">
                      <strong>{m.content}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="text-left">
                    <div className="inline-block p-4 rounded-lg">
                      <Markdown>{m.content}</Markdown>

                      {m.toolInvocations
                        ? m.toolInvocations.map((t, i) => {
                            if (
                              t.toolName === "evaluateShot" &&
                              t.state === "result"
                            ) {
                              return (
                                <Card key={t.toolCallId} className="p-4 mt-2">
                                  <h3 className="font-bold">Shot Evaluation</h3>
                                  <p>{t.result.feedback}</p>
                                </Card>
                              );
                            }
                            if (t.toolName === "answer") {
                              return (
                                <Card key={t.toolCallId} className="p-4 mt-2">
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
                    </div>
                  </div>
                )}
              </div>
            ))}

            {!isLoading && messages.length > 0 && (
              <Card className="p-4 mt-2">
                <h3 className="font-bold">Follow Up</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <Label htmlFor="followUpInput">Your Input</Label>
                    <Input
                      id="followUpInput"
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </Card>
            )}
          </>
        </ScrollArea>
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={input} hidden />
          {step === "setup" && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Knob
                  value={formData.grindSize}
                  min={0}
                  max={5}
                  step={0.1}
                  onChange={value => handleKnobChange("grindSize", value)}
                  label="Grind Size"
                  unit="crs <--> fn"
                  id="grindSize"
                />
                <Knob
                  value={formData.grindWeight}
                  min={14}
                  max={22}
                  step={0.5}
                  onChange={value => handleKnobChange("grindWeight", value)}
                  label="Grind Weight"
                  unit="g"
                  id="grindWeight"
                />
                <Knob
                  value={formData.grindTime}
                  min={5}
                  max={25}
                  step={0.5}
                  onChange={value => handleKnobChange("grindTime", value)}
                  label="Grind Time"
                  unit="s"
                  id="grindTime"
                />
              </div>
              <Button
                type="button"
                onClick={handleStartBrewing}
                className="w-full"
              >
                Start Brewing
              </Button>
            </>
          )}
          {step === "brewing" && (
            <div className="text-center">
              <div className="text-4xl font-bold mb-4">
                {elapsedTime.toFixed(1)}s
              </div>
              <Button
                type="button"
                onClick={handleStopBrewing}
                className="w-full"
              >
                Stop Brewing
              </Button>
            </div>
          )}
          {step === "weighing" && (
            <>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold">
                  Shot Time: {formData.shotTime.toFixed(1)}s
                </div>
              </div>
              <div className="flex justify-center">
                <Knob
                  value={formData.shotWeight || 25}
                  min={25}
                  max={45}
                  step={0.5}
                  onChange={value => handleKnobChange("shotWeight", value)}
                  label="Shot Weight"
                  unit="g"
                  id="shotWeight"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={resetForm}
                  size="icon"
                  variant="ghost"
                >
                  <IterationCw />
                </Button>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {!isLoading ? (
                    <>
                      Submit Results
                      <div className="ml-2 grid [&>*]:col-start-1 [&>*]:row-start-1 z-20 scale-125">
                        <Sparkle className="size-4 p-0.5 fill-current stroke-current drop-shadow-[0_0px_0.5px_rgba(0,0,0,0.5)]" />
                        <Sparkle className="size-1.5 fill-current stroke-current drop-shadow-[0_0px_0.5px_rgba(0,0,0,0.5)]" />
                      </div>
                    </>
                  ) : (
                    <>
                      Analyzing...
                      <Loader className="ml-2 animate-spin-slow size-4 stroke-current z-20" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
