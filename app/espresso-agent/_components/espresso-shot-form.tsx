import { Button } from "@/components/ui/button";
import { Knob } from "./knob";
import {
  ChevronDown,
  Coffee,
  IterationCw,
  Loader,
  Sparkle,
} from "lucide-react";
import type { EspressoShot } from "../schema";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type EspressoShotFormProps = {
  input: string;
  setInput: (input: string) => void;
  step: "setup" | "brewing" | "weighing";
  formData: {
    grindSize: number;
    grindWeight: number;
    grindTime: number;
    shotWeight: number;
    shotTime: number;
  };
  elapsedTime: number;
  isLoading: boolean;
  handleKnobChange: (name: keyof EspressoShot, value: number) => void;
  handleStartBrewing: () => void;
  handleStopBrewing: () => void;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
};

const EspressoShotForm = ({
  input,
  setInput,
  step,
  formData,
  elapsedTime,
  isLoading,
  handleKnobChange,
  handleStartBrewing,
  handleStopBrewing,
  resetForm,
  handleSubmit,
}: EspressoShotFormProps) => {
  return (
    <div className="p-4 border-t flex ">
      <Label htmlFor="followUpInput" className="sr-only">
        Basic chat
      </Label>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex gap-2 items-center">
          <Input
            id="followUpInput"
            type="text"
            placeholder="Chat with the espresso agent..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-grow"
            disabled={isLoading}
          />

          <Button disabled={isLoading} type="submit">
            Chat
          </Button>
        </div>
      </form>
      <FormDrawer>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={input} hidden readOnly />
          {step === "setup" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Knob
                value={formData.grindSize}
                min={0}
                max={5}
                step={0.1}
                onChange={value => handleKnobChange("grindSize", value)}
                label="Grind Size"
                helpText="crs <--> fn"
                id="grindSize"
              />
              <Knob
                value={formData.grindWeight}
                min={14}
                max={22}
                step={0.1}
                onChange={value => handleKnobChange("grindWeight", value)}
                label="Grind Weight"
                unit="g"
                id="grindWeight"
              />
              <Knob
                value={formData.grindTime}
                min={5}
                max={25}
                step={0.1}
                onChange={value => handleKnobChange("grindTime", value)}
                label="Grind Time"
                unit="s"
                id="grindTime"
              />
            </div>
          )}
          {step === "brewing" && (
            <div className="text-center">
              <div className="text-4xl font-bold mb-4">
                {elapsedTime.toFixed(1)}s
              </div>
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
                  step={0.1}
                  onChange={value => handleKnobChange("shotWeight", value)}
                  label="Shot Weight"
                  unit="g"
                  id="shotWeight"
                />
              </div>
            </>
          )}

          {/* button sections */}
          <div className="flex gap-2">
            {step === "setup" && (
              <Button
                type="button"
                onClick={handleStartBrewing}
                className="w-full"
              >
                Start Brewing
              </Button>
            )}
            {step === "brewing" && (
              <Button
                type="button"
                onClick={handleStopBrewing}
                className="w-full"
              >
                Stop Brewing
              </Button>
            )}
            {step === "weighing" && (
              <>
                <Button
                  type="button"
                  onClick={resetForm}
                  size="icon"
                  variant="ghost"
                >
                  <IterationCw />
                </Button>
                <DrawerClose asChild>
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
                </DrawerClose>
              </>
            )}
            <DrawerClose asChild>
              <Button type="button" size="icon" variant="ghost">
                <ChevronDown />
              </Button>
            </DrawerClose>
          </div>
        </form>
      </FormDrawer>
    </div>
  );
};

export default EspressoShotForm;

const FormDrawer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button type="button" className="ml-2 gap-2">
          <Coffee size={16} /> Brew
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-2">{children}</DrawerContent>
    </Drawer>
  );
};
