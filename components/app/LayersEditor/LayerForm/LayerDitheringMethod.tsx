import { Group } from "@radix-ui/react-select";
import { useState } from "react";
import { COLOR_PROCESSING_ALGORITHMS } from "../../../../lib/constants/color-processing-algorithms";
import {
  DiffusionMatrix,
  ERROR_DIFFUSION_MATRIXES,
} from "../../../../lib/constants/diffusion-matrixes";
import { Layer } from "../../../../lib/constants/layers";
import { KeysOf } from "../../../../lib/utils/types";
import { Select, SelectItem } from "../../../UI/Select";
import { LayerFormUpdate } from "./layer-form-types";

export interface LayerDitheringMethodProps
  extends LayerFormUpdate<Layer["dithering"]["method"]> {}

type ColorProcessingAlgorithms = typeof COLOR_PROCESSING_ALGORITHMS;
type ErrorDiffusionMatrixes = typeof ERROR_DIFFUSION_MATRIXES;

type DitheringMethod =
  | keyof ColorProcessingAlgorithms
  | keyof ErrorDiffusionMatrixes
  | "custom"
  | "none";

type FilteringOptions = KeysOf<ColorProcessingAlgorithms>;
type ErrorDiffusionOptions = KeysOf<ErrorDiffusionMatrixes>;

const DITHERING_OPTIONS = {
  filtering: Object.keys(COLOR_PROCESSING_ALGORITHMS) as FilteringOptions,
  error_diffusion: Object.keys(
    ERROR_DIFFUSION_MATRIXES
  ) as ErrorDiffusionOptions,
  custom: ["none", "custom"],
};

export default function LayerDitheringMethod({
  onChange,
  value,
}: LayerDitheringMethodProps) {
  const [ditheringMethod, setDitheringMethod] = useState<DitheringMethod>(
    typeof value === "undefined"
      ? "none"
      : Array.isArray(value)
      ? "custom"
      : (value as
          | keyof ColorProcessingAlgorithms
          | keyof ErrorDiffusionMatrixes)
  );

  return (
    <Select
      label="Method"
      onValueChange={(newDitheringMethod: DitheringMethod) => {
        setDitheringMethod(newDitheringMethod);
        onChange(
          newDitheringMethod === "custom"
            ? ([] as DiffusionMatrix)
            : newDitheringMethod === "none"
            ? undefined
            : (newDitheringMethod as
                | keyof ColorProcessingAlgorithms
                | keyof ErrorDiffusionMatrixes)
        );
      }}
      value={ditheringMethod}
    >
      {(Object.keys(DITHERING_OPTIONS) as KeysOf<typeof DITHERING_OPTIONS>).map(
        (group) => (
          <Group key={group}>
            {DITHERING_OPTIONS[group].map((option) => (
              <SelectItem
                disabled={option === "custom"}
                value={option}
                key={option}
              >
                {option}
              </SelectItem>
            ))}
          </Group>
        )
      )}
    </Select>
  );
}
