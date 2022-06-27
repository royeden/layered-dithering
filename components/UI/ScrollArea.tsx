import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { forwardRef } from "react";
import classNames from "../../lib/utils/classNames";

export interface ScrollAreaProps extends ScrollAreaPrimitive.ScrollAreaProps {
  containerClassName?: string;
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollAreaWithProps(
    { children, className, containerClassName, ...props }: ScrollAreaProps,
    forwardedRef
  ) {
    return (
      <ScrollAreaPrimitive.Root
        ref={forwardedRef}
        {...props}
        className={containerClassName}
      >
        <ScrollAreaPrimitive.Viewport className={className}>
          <div className="pr-3">{children}</div>
        </ScrollAreaPrimitive.Viewport>
        <ScrollAreaPrimitive.ScrollAreaScrollbar
          className="flex touch-none select-none rounded-lg bg-gray-200 p-0.5 transition-colors duration-300 radix-orientation-vertical:w-2 dark:bg-gray-800"
          orientation="vertical"
        >
          <ScrollAreaPrimitive.ScrollAreaThumb className="grow rounded-full bg-purple-500 before:absolute before:top-1/2 before:left-1/2 before:w-2 before:-translate-x-1/2 before:-translate-y-1/2" />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  }
);

export default ScrollArea;
