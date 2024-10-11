import { Button } from "./ui/button";

export const GenerateButton = ({ children }: { children: React.ReactNode }) => {
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
