"use client";
import { useChat } from "ai/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader, Sparkle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GenerateButton } from "@/components/generate-button";

export default function EspressoAgentPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/espresso-agent/api",
      maxSteps: 10,
    });

  return (
    <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
      <ScrollArea
        style={{
          height: "calc(100vh - (121px))",
        }}
      >
        <div className="px-4 pt-12 pb-20">
          {messages.map(m => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === "user" ? "User: " : "AI: "}
              {m.role === "user" && <strong>{m.content}</strong>}
              {m.role !== "user" && <p>{m.content}</p>}
              {m.toolInvocations ? (
                <>
                  {m.toolInvocations.map((t, i) => {
                    if (t.toolName === "calculate" && t.state === "result") {
                      return (
                        <Card
                          key={t.toolCallId}
                          className="p-4 mb-4 rounded-none"
                        >
                          <h3>Calculate</h3>
                          <p className="text-2xl">
                            {t.args.expression} ={" "}
                            <strong>{t.result.result}</strong>
                          </p>
                        </Card>
                      );
                    }
                    if (t.toolName === "answer") {
                      return (
                        <Card
                          key={t.toolCallId}
                          className="p-4 mb-4 rounded-none"
                        >
                          <h3>Answer</h3>
                          <p>{t.args.answer}</p>
                        </Card>
                      );
                    }
                  })}
                </>
              ) : null}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div
        className="bg-gradient-to-t to-10% from-background/75 to-transparent pointer-events-none z-20"
        style={{
          height: "calc(100vh - (121px))",
        }}
      />

      <div className="grid place-content-end justify-stretch">
        <hr className="border-t border" />
        <form
          onSubmit={handleSubmit}
          className="grid [&>*]:col-start-1 [&>*]:row-start-1 bg-background p-4"
        >
          <Label htmlFor="prompt">Prompt</Label>
          <div className="pt-5 flex gap-4">
            <Input
              id="prompt"
              className=""
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
            <GenerateButton>
              {!isLoading && (
                <div className="grid [&>*]:col-start-1 [&>*]:row-start-1 z-20 scale-125">
                  <Sparkle className="size-4 p-0.5 fill-current stroke-current drop-shadow-[0_0px_0.5px_rgba(0,0,0,0.5)]" />
                  <Sparkle className="size-1.5 fill-current stroke-current drop-shadow-[0_0px_0.5px_rgba(0,0,0,0.5)]" />
                  <span className="sr-only">Generate</span>
                </div>
              )}
              {isLoading && (
                <Loader className="animate-spin-slow size-4 stroke-current z-20" />
              )}
            </GenerateButton>
          </div>
        </form>
      </div>
    </div>
  );
}
