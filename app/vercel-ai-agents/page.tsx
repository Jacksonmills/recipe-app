"use client";
import { useChat } from "ai/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader, Sparkle } from "lucide-react";

const schema = z.object({
  prompt: z.string().min(1),
});

export default function VercelAiAgentsPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/vercel-ai-agents/api",
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
              {m.toolInvocations && (
                <pre>{JSON.stringify(m.toolInvocations, null, 10)}</pre>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {!messages && (
        <div
          className="p-2 md:p-20"
          style={{
            height: "calc(100vh - (121px))",
          }}
        >
          <div className="flex items-center justify-center h-full border border-dashed flex-col text-token-text-primary">
            <p className="text-lg text-gray-500 w-1/2 text-balance">
              Enter a prompt to generate a recipe
            </p>
          </div>
        </div>
      )}

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
          <div className="pt-5 flex">
            <input
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
        {/* <Form label="Prompt" schema={schema} onSubmit={handleSubmit}>
          <div className="pt-5">
            <InputField
              name="prompt"
              label="Prompt:"
              placeholder="What recipe do you want?"
            />
          </div>
        </Form> */}
      </div>
    </div>
  );
}

const GenerateButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative group grid [&>*]:col-start-1 [&>*]:row-start-1 overflow-hidden rounded-full min-w-9 drop-shadow">
      <div className="absolute -top-5 -left-1.5 size-12 aspect-square bg-generate-foreground rounded-full opacity-10 pointer-events-none" />

      <div
        className="mt-1 w-[60%] h-6 bg-gradient-to-b from-generate-highlight to-transparent rounded-full transform mx-auto from-[-10%] to-25% z-20"
        style={{
          borderRadius: "100% 100% 40% 40% / 45% 45% 40% 40%",
        }}
      />

      <Button
        type="submit"
        size="icon"
        className="rounded-full aspect-square border border-generate-neutral bg-[radial-gradient(var(--generate-gradient))] grid [&>*]:col-start-1 [&>*]:row-start-1 p-0 text-generate-text"
      >
        {children}
      </Button>

      <div className="size-full bg-generate-background rounded-full opacity-50 pointer-events-none absolute top-0 left-0" />
    </div>
  );
};
