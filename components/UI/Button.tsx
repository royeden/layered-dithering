import { ElementType, forwardRef } from "react";
import classNames from "../../lib/utils/classNames";
import {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from "../../lib/utils/react";

export type ButtonProps<C extends ElementType> =
  PolymorphicComponentPropWithRef<
    C,
    {
      external?: boolean;
      size?: "sm" | "md" | "lg" | "none";
      theme?:
        | "primary"
        | "secondary"
        | "tertiary"
        | "danger"
        | "transparent"
        | "none";
    }
  >;

const Button = forwardRef(function ButtonWithRef<
  C extends ElementType = "button"
>(
  {
    as,
    children,
    className,
    external,
    size = "md",
    theme = "primary",
    ...props
  }: ButtonProps<C>,
  ref?: PolymorphicRef<C>
) {
  const Component = as || "button";
  const additionalProps =
    as === "a" && external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

  return (
    <Component
      ref={ref}
      className={classNames(
        "cursor-pointer select-none rounded-lg transition duration-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 active:ring-opacity-0",
        size === "sm" && "px-3 py-1 font-medium tracking-normal",
        size === "md" && "px-4 py-2 font-semibold tracking-wide",
        size === "lg" && "px-6 py-3 font-bold tracking-wide",
        {
          "bg-indigo-600 text-white": theme === "primary",
          "hover:enabled:bg-indigo-500":
            theme === "primary" && Component === "button",
          "hover:bg-indigo-500": theme === "primary" && Component !== "button",
        },
        {
          "bg-red-600 text-white": theme === "danger",
          "hover:enabled:bg-red-500":
            theme === "danger" && Component === "button",
          "hover:bg-red-500": theme === "danger" && Component !== "button",
        },
        {
          "text-gray-800 dark:text-gray-200": theme === "transparent",
          "hover:enabled:bg-black/5  dark:hover:enabled:bg-white/5":
            theme === "transparent" && Component === "button",
          "hover:bg-black/5  dark:hover:bg-white/5":
            theme === "transparent" && Component !== "button",
        },
        className
      )}
      {...additionalProps}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Button;
