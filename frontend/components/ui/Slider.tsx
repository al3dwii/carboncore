"use client";
import { forwardRef } from "react";
import * as RadixSlider from "@radix-ui/react-slider";

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof RadixSlider.Root> {}

export const Slider = forwardRef<
  React.ElementRef<typeof RadixSlider.Root>,
  SliderProps
>(function Slider(props, ref) {
  return (
    <RadixSlider.Root
      ref={ref}
      className="relative flex h-5 w-full touch-none select-none items-center"
      {...props}
    >
      <RadixSlider.Track className="relative h-[3px] grow rounded-full bg-white/20">
        <RadixSlider.Range className="absolute h-full rounded-full bg-green-500" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block size-4 rounded-full bg-green-500" />
    </RadixSlider.Root>
  );
});
