import { ArrowRightIcon, TrashIcon } from "@radix-ui/react-icons";
import { Fragment, useState } from "react";
import { Layer } from "../../../../lib/constants/layers";
import { createColor } from "../../../../lib/utils/color";
import { random } from "../../../../lib/utils/math";
import Button from "../../../UI/Button";
import ColorPicker from "../../../UI/ColorPicker";
import { LayerFormUpdate } from "./layer-form-types";

export interface LayerColorsProps
  extends LayerFormUpdate<Layer["dithering"]["pallete"]> {}

export default function LayerColors({ onChange, value }: LayerColorsProps) {
  const [pallete, setPallete] = useState(value);

  return (
    <div className="space-y-2">
      <p>Colors:</p>
      <div className="grid w-full grid-cols-4 items-center gap-2">
        {pallete.map(([from, to], colors) => (
          <Fragment key={`${colors}`}>
            <div className="col-span-3 flex items-center justify-between space-x-2">
              <ColorPicker
                align="start"
                className="w-48 md:w-full"
                onValueChange={(colorFrom) => {
                  setPallete((prevPallete) => {
                    const newPallete = prevPallete.map(([from, to], index) =>
                      index === colors ? [colorFrom, to] : [from, to]
                    ) as Layer["dithering"]["pallete"];
                    onChange(newPallete);
                    return newPallete;
                  });
                }}
                value={from}
              />
              <ArrowRightIcon />
              <ColorPicker
                align="end"
                className="w-48 md:w-full"
                onValueChange={(colorTo) => {
                  setPallete((prevPallete) => {
                    const newPallete = prevPallete.map(([from, to], index) =>
                      index === colors ? [from, colorTo] : [from, to]
                    ) as Layer["dithering"]["pallete"];
                    onChange(newPallete);
                    return newPallete;
                  });
                }}
                value={to}
              />
            </div>
            {pallete.length > 2 && (
              <div className="flex w-full items-center justify-center">
                <Button
                  onClick={() =>
                    setPallete((prevPallete) => {
                      const newPallete = prevPallete.filter(
                        (_, index) => index !== colors
                      ) as Layer["dithering"]["pallete"];
                      onChange(newPallete);
                      return newPallete;
                    })
                  }
                  size="sm"
                  theme="danger"
                >
                  <TrashIcon />
                </Button>
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <Button
        className="w-full"
        onClick={() =>
          setPallete((prevPallete) => {
            const newPallete = [
              ...prevPallete,
              [
                createColor([
                  random(0, 255),
                  random(0, 255),
                  random(0, 255),
                  255,
                ]),
                createColor([
                  random(0, 255),
                  random(0, 255),
                  random(0, 255),
                  random(0, 255),
                ]),
              ],
            ] as Layer["dithering"]["pallete"];
            onChange(newPallete);
            return newPallete;
          })
        }
        size="sm"
      >
        Add color
      </Button>
    </div>
  );
}
