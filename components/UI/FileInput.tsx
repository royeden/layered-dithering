import { HTMLAttributes, ReactNode } from "react";
import useFileDND from "../../lib/hooks/useFileDnd";
import classNames from "../../lib/utils/classNames";

interface Props
  extends Omit<
    HTMLAttributes<HTMLInputElement>,
    "onChange" | "onError" | "children"
  > {
  accept: string;
  children: (dragOver: boolean) => ReactNode;
  className?: string;
  id?: string;
  multiple?: boolean;
  name: string;
  onError: (error: Error) => void;
  onChange: (files: File | File[]) => void;
}

export default function FileInput({
  accept,
  children,
  className,
  id,
  multiple,
  name,
  onChange,
  onError,
  ...props
}: Props) {
  const identifier = id ?? name;

  const { dragOver, onDragLeave, onDragOver, onDrop, onSelect } = useFileDND({
    accept,
    multiple,
    onChange,
    onError: console.error,
  });

  return (
    <label
      className={classNames(
        className,
        "relative inline-block w-full cursor-pointer rounded-sm border-2 border-dashed p-4 text-center ring-purple-600 transition duration-300 focus-within:ring-2",
        dragOver && "border-purple-500"
      )}
      htmlFor={identifier}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <input
        {...props}
        accept={accept}
        className="absolute inset-0 h-0 w-0"
        id={identifier}
        name={name}
        type="file"
        onChange={onSelect}
      />
      {children(dragOver)}
    </label>
  );
}
