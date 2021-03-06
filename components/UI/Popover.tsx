import { Cross1Icon } from "@radix-ui/react-icons";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { forwardRef, Ref } from "react";
import classNames from "../../lib/utils/classNames";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export interface PopoverContentProps
  extends PopoverPrimitive.PopoverContentProps {}

export const PopoverContent = forwardRef(function PopoverContentWithRef(
  { align, children, className, ...props }: PopoverContentProps,
  forwardedRef: Ref<HTMLDivElement>
) {
  // TODO replace max-w
  return (
    <PopoverPrimitive.Content
      ref={forwardedRef}
      {...props}
      align={align ?? "center"}
      className={classNames(
        className,
        "z-10 rounded-lg bg-white px-2 pb-2 pt-8 shadow-md radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down radix-side-left:animate-slide-left-fade radix-side-right:animate-slide-right-fade dark:bg-gray-700 sm:px-4 sm:pt-12 sm:pb-4"
      )}
      sideOffset={4}
    >
      {children}
      <PopoverPrimitive.Arrow
        height={7}
        width={12}
        className="z-20 fill-current text-gray-700/5 dark:text-white/5"
      />
      <PopoverPrimitive.Arrow className="z-20 fill-current text-white dark:text-gray-700" />
      <PopoverPrimitive.Close
        className={classNames(
          "absolute top-1 right-1 inline-flex items-center justify-center rounded-full p-1 transition duration-300 sm:top-3.5 sm:right-3.5",
          "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
        )}
      >
        <Cross1Icon className="h-4 w-4 text-gray-500 transition-colors duration-300 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-100" />
      </PopoverPrimitive.Close>
    </PopoverPrimitive.Content>
  );
});
