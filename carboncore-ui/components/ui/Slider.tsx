"use client";
import { forwardRef } from "react";
import * as RadixSlider from "@radix-ui/react-slider";

export interface SliderProps extends RadixSlider.SliderProps {}

export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(props, ref) {
  return (
    <RadixSlider.Root ref={ref} className="relative flex items-center select-none touch-none w-full h-5" {...props}>
      <RadixSlider.Track className="bg-white/20 relative grow rounded-full h-[3px]">
        <RadixSlider.Range className="absolute bg-green-500 rounded-full h-full" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block w-4 h-4 bg-green-500 rounded-full" />
    </RadixSlider.Root>
  );
});
