import { forwardRef, HTMLAttributes, Ref } from "react";
import classNames from "../../../lib/utils/classNames";
import Button from "../../UI/Button";

export interface LayerButtonProps extends HTMLAttributes<HTMLButtonElement> {}

const LayerButton = forwardRef(function LayerButtonWithRef(
  { children, className, ...props }: LayerButtonProps,
  forwardedRef: Ref<HTMLButtonElement>
) {
  return (
    <Button
      ref={forwardedRef}
      {...props}
      className={classNames(
        "w-full border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-700",
        className
      )}
      size="lg"
      theme="none"
      type="button"
    >
      {children}
    </Button>
  );
});

export default LayerButton;
