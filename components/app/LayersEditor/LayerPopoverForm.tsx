import { ArrowRightIcon, TrashIcon } from "@radix-ui/react-icons";
import { Group } from "@radix-ui/react-select";
import fastDeepEqual from "fast-deep-equal/es6";
import {
  FormEventHandler,
  Fragment,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BLEND_MODES } from "../../../lib/constants/canvas";
import { COLOR_PROCESSING_ALGORITHMS } from "../../../lib/constants/color-processing-algorithms";
import {
  DiffusionMatrix,
  ERROR_DIFFUSION_MATRIXES,
} from "../../../lib/constants/diffusion-matrixes";
import { Layer } from "../../../lib/constants/layers";
import useClonedLayer from "../../../lib/hooks/useClonedLayer";
import { createColor } from "../../../lib/utils/color";
import { debounce } from "../../../lib/utils/functions";
import { random } from "../../../lib/utils/math";
import { KeysOf } from "../../../lib/utils/types";
import { useLayersContext } from "../../context/LayersContext";
import Button from "../../UI/Button";
import ColorPicker from "../../UI/ColorPicker";
import { Select, SelectItem } from "../../UI/Select";
import { Slider } from "../../UI/Slider";

export interface LayerPopoverFormProps {
  autoupdate: boolean;
  className?: string;
  layer: Layer;
}

type FilteringOptions = KeysOf<typeof COLOR_PROCESSING_ALGORITHMS>;

type ErrorDiffusionOptions = KeysOf<typeof ERROR_DIFFUSION_MATRIXES>;

export default function LayerPopoverForm({
  autoupdate,
  className,
  layer,
}: LayerPopoverFormProps) {
  const { updateLayer } = useLayersContext();

  const [clonedLayer, updateClonedLayer] = useClonedLayer(layer);

  const DITHERING_OPTIONS = {
    filtering: Object.keys(COLOR_PROCESSING_ALGORITHMS) as FilteringOptions,
    error_diffusion: Object.keys(
      ERROR_DIFFUSION_MATRIXES
    ) as ErrorDiffusionOptions,
    custom: ["none", "custom"],
  };

  const debouncedUpdateLayer = useMemo(
    () => debounce(updateLayer, 150),
    [updateLayer]
  );

  useEffect(() => {
    if (autoupdate && !fastDeepEqual(clonedLayer, layer)) {
      debouncedUpdateLayer(clonedLayer);
    }
  }, [autoupdate, clonedLayer, debouncedUpdateLayer, layer]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    updateLayer(clonedLayer);
  };

  const method =
    typeof clonedLayer.dithering.method === "undefined"
      ? "none"
      : Array.isArray(clonedLayer.dithering.method)
      ? "custom"
      : (clonedLayer.dithering.method as
          | keyof typeof COLOR_PROCESSING_ALGORITHMS
          | keyof typeof ERROR_DIFFUSION_MATRIXES);

  return (
    <form className={className} onSubmit={handleSubmit}>
      <Slider
        label={"Opacity:"}
        max={100}
        min={0}
        name="opacity"
        onValueChange={([opacity]) =>
          updateClonedLayer({
            transformations: {
              opacity,
            },
          })
        }
        value={[clonedLayer.transformations.opacity]}
      />
      <Select
        label="Method"
        onValueChange={(ditheringMethod) =>
          updateClonedLayer({
            dithering: {
              method:
                ditheringMethod === "custom"
                  ? ([] as DiffusionMatrix)
                  : ditheringMethod === "none"
                  ? undefined
                  : (ditheringMethod as
                      | keyof typeof COLOR_PROCESSING_ALGORITHMS
                      | keyof typeof ERROR_DIFFUSION_MATRIXES),
            },
          })
        }
        value={method}
      >
        {(
          Object.keys(DITHERING_OPTIONS) as KeysOf<typeof DITHERING_OPTIONS>
        ).map((group) => (
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
        ))}
      </Select>
      <Select
        label="Blend mode"
        onValueChange={(blendMode: GlobalCompositeOperation) =>
          updateClonedLayer({
            transformations: {
              blendMode,
            },
          })
        }
        value={clonedLayer.transformations.blendMode}
      >
        {BLEND_MODES.map((option) => (
          <SelectItem value={option} key={option}>
            {option}
          </SelectItem>
        ))}
      </Select>
      <div className="space-y-2">
        <p>Colors:</p>
        <div className="grid w-full grid-cols-4 items-center gap-2">
          {clonedLayer.dithering.pallete.map(([from, to], pallete) => (
            <Fragment key={`${pallete}`}>
              <div className="col-span-3 flex items-center justify-between space-x-2">
                <ColorPicker
                  align="start"
                  className="w-48 md:w-full"
                  onValueChange={(colorFrom) =>
                    updateClonedLayer((prevClonedLayer) => ({
                      dithering: {
                        pallete: prevClonedLayer.dithering.pallete.map(
                          ([from, to], index) =>
                            index === pallete ? [colorFrom, to] : [from, to]
                        ),
                      },
                    }))
                  }
                  value={from}
                />
                <ArrowRightIcon />
                <ColorPicker
                  align="end"
                  className="w-48 md:w-full"
                  onValueChange={(colorTo) =>
                    updateClonedLayer((prevClonedLayer) => ({
                      dithering: {
                        pallete: prevClonedLayer.dithering.pallete.map(
                          ([from, to], index) =>
                            index === pallete ? [from, colorTo] : [from, to]
                        ),
                      },
                    }))
                  }
                  value={to}
                />
              </div>
              {clonedLayer.dithering.pallete.length > 2 && (
                <button
                  className="flex w-full items-center justify-center"
                  onClick={() =>
                    updateClonedLayer((prevClonedLayer) => ({
                      dithering: {
                        pallete: prevClonedLayer.dithering.pallete.filter(
                          (_, index) => index !== pallete
                        ),
                      },
                    }))
                  }
                  type="button"
                >
                  <TrashIcon />
                </button>
              )}
            </Fragment>
          ))}
        </div>
        <Button
          className="w-full"
          onClick={() =>
            updateClonedLayer((prevClonedLayer) => ({
              dithering: {
                pallete: [
                  ...prevClonedLayer.dithering.pallete,
                  [
                    createColor([
                      random(0, 255),
                      random(0, 255),
                      random(0, 255),
                      random(0, 255),
                    ]),
                    createColor([
                      random(0, 255),
                      random(0, 255),
                      random(0, 255),
                      random(0, 255),
                    ]),
                  ],
                ],
              },
            }))
          }
          size="sm"
        >
          Add color
        </Button>
      </div>
    </form>
  );
}
