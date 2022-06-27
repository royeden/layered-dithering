import { ChangeEvent, DragEvent, SyntheticEvent, useState } from "react";
import parseFileType from "../utils/parseFileType";

interface UseFileDNDOptions {
  accept: string;
  multiple?: boolean;
  onChange: (files: File | File[]) => void;
  onError: (error: Error) => void;
}

export default function useFileDND({
  accept,
  multiple = false,
  onChange,
  onError,
}: UseFileDNDOptions) {
  const [dragOver, setDragOver] = useState(false);

  const selectFiles = (selectedFiles: File | File[]) => {
    try {
      if (Array.isArray(selectedFiles)) {
        if (!selectFiles.length) throw new Error("No file was provided!");
        selectedFiles.forEach((file) => parseFileType(file, accept));
      } else {
        parseFileType(selectedFiles, accept);
      }
      onChange(selectedFiles);
    } catch (error) {
      onError(error as Error);
    }
  };

  const onDragOver = (event: SyntheticEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    setDragOver(false);

    selectFiles(
      multiple
        ? Array.from(event.dataTransfer.files)
        : event.dataTransfer.files[0]
    );
  };

  const onSelect = (event: ChangeEvent<HTMLInputElement>) => {
    selectFiles(
      multiple
        ? Array.from(event?.target?.files ?? [])
        : event?.target?.files?.[0] ?? []
    );
  };

  return {
    dragOver,
    onDrop,
    onDragOver,
    onDragLeave,
    onSelect,
  };
}
