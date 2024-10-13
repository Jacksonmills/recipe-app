"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";

type KnobProps = {
  id: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  label: string;
  unit?: string;
  helpText?: string;
};

export const Knob = ({
  id,
  value,
  min,
  max,
  step,
  onChange,
  label,
  unit,
  helpText,
}: KnobProps) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const knob = knobRef.current;
    if (!knob) return;

    let isDragging = false;
    let startY: number;
    let startX: number;
    let startValue: number;

    const handleStart = (clientX: number, clientY: number) => {
      isDragging = true;
      startY = clientY;
      startX = clientX;
      startValue = value;
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;
      const deltaY = startY - clientY;
      const deltaX = clientX - startX;
      const delta = deltaY + deltaX;
      const range = max - min;
      const deltaValue = (delta / 200) * range;
      const newValue = Math.min(max, Math.max(min, startValue + deltaValue));
      onChange(Math.round(newValue / step) * step);
    };

    const handleEnd = () => {
      isDragging = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault(); // Prevent text selection and unexpected behavior
      handleStart(e.clientX, e.clientY);
    };
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleMouseUp = () => handleEnd();

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while touching the knob
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchMove = (e: TouchEvent) =>
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchEnd = () => handleEnd();

    knob.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    knob.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      knob.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      knob.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [value, min, max, step, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(e.target.value);
    if (!Number.isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(Math.round(newValue / step) * step);
    }
  };

  const rotation = ((value - min) / (max - min)) * 270 - 135;

  return (
    <Card className="flex flex-col rounded-none w-full">
      <CardHeader>
        <Label htmlFor={id} className="mb-4 mx-auto font-bold text-xl">
          {label}
        </Label>
      </CardHeader>
      <CardContent className="flex md:flex-col items-center gap-12 md:gap-4 justify-center">
        <div className="relative w-20 h-20 flex items-center justify-center group">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            id={id}
            onChange={handleInputChange}
            className="absolute opacity-0 w-full h-full cursor-pointer z-20"
          />
          <div
            className="w-20 h-20 rounded-full bg-card border-4 border-border relative group-focus-within:ring ring-offset-2"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="absolute top-0 left-1/2 w-1 h-4 bg-foreground -translate-x-1/2" />
          </div>
        </div>
        <CardFooter className="grid gap-2">
          <div className="flex items-center gap-1">
            <Input
              ref={inputRef}
              type="number"
              id={id}
              value={value.toFixed(1)}
              onChange={handleInputChange}
              min={min}
              max={max}
              step={step}
              className="mt-2 w-20 text-center pointer-events-none md:pointer-events-auto"
            />
            {unit && <div className="mt-1">{unit}</div>}
          </div>
          {helpText && (
            <p className="text-sm text-muted-foreground">{helpText}</p>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  );
};
