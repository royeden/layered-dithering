import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { KeyboardEventHandler, ReactNode } from "react";

export interface DraggableSortItemProps<Item> {
  children: ReactNode;
  id: string;
  item: Item;
  onKeyDown: KeyboardEventHandler<any>;
}

export default function DraggableSortItem<T extends unknown>({
  children,
  id,
  item,
  onKeyDown,
}: DraggableSortItemProps<T>) {
  // TODO fix scroll issues with drag handle
  // https://codesandbox.io/s/reorder-touch-scrolling-bug-example-0f0z3?file=/src/Item.tsx
  const dragControls = useDragControls();
  const y = useMotionValue(0);
  return (
    <Reorder.Item
      className="relative"
      id={id}
      onKeyDown={onKeyDown}
      value={item}
      style={{ y }}
      dragListener={false}
      dragControls={dragControls}
    >
      <span>{children}</span>
      <span
        className="absolute inset-y-0 right-0 flex cursor-move touch-none items-center p-4 text-gray-800 dark:text-white"
        onPointerDown={(event) => dragControls.start(event)}
      >
        <DragHandleDots2Icon />
      </span>
    </Reorder.Item>
  );
}
