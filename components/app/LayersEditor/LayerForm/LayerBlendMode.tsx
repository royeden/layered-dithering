import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { BLEND_MODES } from "../../../../lib/constants/canvas";
import { Layer } from "../../../../lib/constants/layers";
import Button from "../../../UI/Button";
import { Select, SelectItem } from "../../../UI/Select";
import { LayerFormUpdate } from "./layer-form-types";

export interface LayerBlendModeProps
  extends LayerFormUpdate<Layer["transformations"]["blendMode"]> {}

export default function LayerBlendMode({
  onChange,
  value,
}: LayerBlendModeProps) {
  const [blendMode, setBlendMode] = useState(value);

  return (
    <Select
      label={
        <span className="flex items-center justify-between">
          <span>Blend mode</span>
          <Button
            as="a"
            className="h-4 w-4"
            external
            href="https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation#operations"
            size="none"
            theme="none"
          >
            <InfoCircledIcon
              className="text-white"
              height="100%"
              width="100%"
            />
          </Button>
        </span>
      }
      onValueChange={(newBlendMode: GlobalCompositeOperation) => {
        setBlendMode(newBlendMode);
        onChange(newBlendMode);
      }}
      value={blendMode}
    >
      {BLEND_MODES.map((option) => (
        <SelectItem value={option} key={option}>
          {option}
        </SelectItem>
      ))}
    </Select>
  );
}
