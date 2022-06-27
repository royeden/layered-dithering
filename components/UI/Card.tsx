import { ElementType, forwardRef } from "react";
import classNames from "../../lib/utils/classNames";
import {
  PolymorphicComponentPropWithRef,
  PolymorphicRef,
} from "../../lib/utils/react";

type CardProps<C extends ElementType> = PolymorphicComponentPropWithRef<C, {}>;

const Card = forwardRef(function CardWithRef<C extends ElementType = "div">(
  { as, children, className, ...props }: CardProps<C>,
  ref?: PolymorphicRef<C>
) {
  const Component = as || "div";
  return (
    <Component
      ref={ref}
      className={classNames(
        "bg-white px-8 py-4 shadow-md transition-colors duration-300 dark:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

export default Card;
