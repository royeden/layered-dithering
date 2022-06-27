import { Reorder } from "framer-motion";
import {
  forwardRef,
  ForwardedRef,
  Key,
  KeyboardEvent,
  SyntheticEvent,
  useRef,
  ReactNode,
} from "react";
import mergeRefs from "../../../lib/utils/mergeRefs";
import DraggableSortItem from "./item";

export interface DraggableSortProps<Item> {
  children: (item: Item, index: number) => ReactNode;
  className?: string;
  keyExtractor?: (item: Item) => Key;
  items: Item[];
  onBlur?: (
    event: SyntheticEvent<HTMLUListElement, FocusEvent>
  ) => void | undefined;
  onFocus?: (
    event: SyntheticEvent<HTMLUListElement, FocusEvent>
  ) => void | undefined;
  onKeyDown?: (event: KeyboardEvent<any>, index: number) => void;
  onSort: (newItems: Item[]) => void;
}

const DraggableSort = forwardRef(function DraggableSortWithRef<
  T extends unknown
>(
  {
    children,
    className = "",
    keyExtractor,
    items,
    onKeyDown,
    onSort,
    ...props
  }: DraggableSortProps<T>,
  forwardedRef: ForwardedRef<HTMLUListElement>
) {
  const ref = useRef<HTMLUListElement>(null!);

  const handleKeyDown = (event: KeyboardEvent<any>, index: number) => {
    const { key } = event;
    if (
      (key === "ArrowUp" || key === "ArrowDown") &&
      ref.current?.contains(event.target as HTMLElement)
    ) {
      event.preventDefault();
      const targetIndex =
        key === "ArrowDown"
          ? (index + 1) % items.length
          : index
          ? index - 1
          : items.length - 1;
      const newItems = items.slice();
      [newItems[index], newItems[targetIndex]] = [
        items[targetIndex],
        items[index],
      ];
      onKeyDown?.(event, targetIndex);
      onSort(newItems);
    }
  };

  return (
    <Reorder.Group
      ref={mergeRefs(ref, forwardedRef)}
      {...props}
      axis="y"
      className={className}
      onReorder={onSort}
      layoutScroll
      values={items}
    >
      {items.map((item, index) => (
        <DraggableSortItem
          key={keyExtractor?.(item) ?? `${item}`}
          id={`${keyExtractor?.(item) ?? `${item}`}`}
          item={item}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {children(item, index)}
        </DraggableSortItem>
      ))}
    </Reorder.Group>
  );
});

export default DraggableSort;
