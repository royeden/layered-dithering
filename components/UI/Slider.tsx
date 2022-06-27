import { Label } from "@radix-ui/react-label";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { forwardRef, ReactNode, Ref } from "react";
import classNames from "../../lib/utils/classNames";

export interface SliderProps extends SliderPrimitive.SliderProps {
  containerClassName?: string;
  id?: string;
  label?: ReactNode;
  labelClassName?: string;
  name: string;
  value: number[];
}

export const Slider = forwardRef(function SliderWithRef(
  {
    className,
    containerClassName,
    id,
    label,
    labelClassName,
    name,
    value,
    ...props
  }: SliderProps,
  forwardedRef: Ref<HTMLSpanElement>
) {
  const identifier = id ?? name;

  return (
    <div
      className={classNames(
        "flex w-full flex-col items-center",
        containerClassName
      )}
    >
      {label && (
        <Label
          className={classNames("w-full", labelClassName)}
          htmlFor={identifier}
        >
          {label}
        </Label>
      )}
      <SliderPrimitive.Slider
        className={"relative flex h-5 w-full touch-none items-center"}
        value={value}
        {...props}
        ref={forwardedRef}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow rounded-full bg-white dark:bg-gray-800">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-indigo-600 dark:bg-white" />
        </SliderPrimitive.Track>
        {value.map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className="block h-5 w-5 rounded-full bg-indigo-600 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:bg-white"
          />
        ))}
      </SliderPrimitive.Slider>
    </div>
  );
});
