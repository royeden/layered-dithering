import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { forwardRef, Fragment, ReactNode, Ref } from "react";
import classNames from "../../lib/utils/classNames";
import { Label } from "@radix-ui/react-label";
import Button from "./Button";

export interface SelectProps extends SelectPrimitive.SelectProps {
  label?: ReactNode;
}

export const Select = forwardRef(function SelectWithRef(
  { children, label, ...props }: SelectProps,
  forwardedRef: Ref<HTMLButtonElement>
) {
  const Wrapper = label ? Label : Fragment;
  return (
    <Wrapper>
      {label}
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          asChild
          className="flex w-full items-center justify-between rounded-lg py-2 px-1 transition duration-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
          ref={forwardedRef}
        >
          <Button size="sm">
            <SelectPrimitive.Value />
            <SelectPrimitive.Icon>
              <ChevronDownIcon />
            </SelectPrimitive.Icon>
          </Button>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Content className="rounded-lg bg-white p-2 shadow-lg dark:bg-gray-700">
          <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="max-h-96">
            {children}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
            <ChevronDownIcon />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Root>
    </Wrapper>
  );
});

export interface SelectItemProps extends SelectPrimitive.SelectItemProps {}

export const SelectItem = forwardRef(function SelectItemWithRef(
  { children, ...props }: SelectItemProps,
  forwardedRef: Ref<HTMLDivElement>
) {
  return (
    <SelectPrimitive.Item
      className={classNames(
        "relative flex items-center rounded-md px-8 py-2 text-sm font-medium text-gray-700 focus:bg-indigo-500 focus:text-white dark:text-white dark:focus:bg-purple-500",
        "radix-disabled:opacity-50",
        "select-none focus:outline-none"
      )}
      {...props}
      ref={forwardedRef}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});
