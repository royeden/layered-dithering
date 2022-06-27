import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef } from "react";

import classNames from "../../lib/utils/classNames";

interface Props extends TooltipPrimitive.TooltipContentProps {}

export const TooltipContent = forwardRef<HTMLDivElement, Props>(
  function TooltipContentWithRef(
    { children, side, sideOffset, ...props },
    forwardedRef
  ) {
    return (
      <TooltipPrimitive.Content
        ref={forwardedRef}
        className={classNames(
          "radix-side-top:animate-slide-down-fade",
          "radix-side-right:animate-slide-left-fade",
          "radix-side-bottom:animate-slide-up-fade",
          "radix-side-left:animate-slide-right-fade",
          "inline-flex items-center rounded-md px-4 py-2.5",
          "bg-white shadow-sm dark:bg-gray-700"
        )}
        side={side ?? "top"}
        sideOffset={sideOffset ?? 4}
        {...props}
      >
        <TooltipPrimitive.Arrow className="fill-current text-white dark:text-gray-700" />
        <span className="block text-xs leading-none text-gray-700 dark:text-gray-100">
          {children}
        </span>
      </TooltipPrimitive.Content>
    );
  }
);

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
