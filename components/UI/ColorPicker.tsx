import { RgbaColorPicker } from "react-colorful";
import { Color } from "../../lib/utils/color";
import { map, round } from "../../lib/utils/math";
import {
  Popover,
  PopoverContent,
  PopoverContentProps,
  PopoverTrigger,
} from "./Popover";

export interface ColorPickerProps extends PopoverContentProps {
  onValueChange: (color: Color) => void;
  value: Color;
}

export default function ColorPicker({
  onValueChange,
  value,
  ...props
}: ColorPickerProps) {
  const { r, g, b, a } = value;
  return (
    <Popover>
      <PopoverTrigger
        className="flex h-6 w-6 items-center justify-center rounded border-2 border-black border-opacity-50 transition duration-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 dark:border-gray-600 dark:backdrop-invert"
        style={{
          backgroundColor: value.hex,
          backgroundImage:
            value.a === 255
              ? undefined
              : `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><rect x="8" width="8" height="8"/><rect y="8" width="8" height="8"/></svg>')`,
        }}
      />
      <PopoverContent side="bottom" {...props}>
        <div className="p-2">
          <RgbaColorPicker
            color={{ r, g, b, a: map(a, 0, 255, 0, 1) }}
            className="!w-full"
            onChange={({ r, g, b, a }) =>
              onValueChange(
                value.set([r, g, b, round(map(a, 0, 1, 0, 255))], true)
              )
            }
          />
          <div className="flex justify-between">
            <span>{value.hex}</span>
            <span className="h-4 w-4" style={{ backgroundColor: value.hex }} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
