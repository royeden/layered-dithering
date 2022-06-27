import { COLOR_PROCESSING_ALGORITHMS } from "./color-processing-algorithms";
import {
  DiffusionMatrix,
  ERROR_DIFFUSION_MATRIXES,
} from "./diffusion-matrixes";
import type { Dimensions, Point } from "./math";
import { BLACK, BLUE, GREEN, RED, TRANSPARENT, WHITE } from "./colors";
import { Color, ColorDistanceOptions } from "../utils/color";
import { KeysOf } from "../utils/types";
import { floor, random, round } from "../utils/math";

export type DitheringMethod = keyof (typeof COLOR_PROCESSING_ALGORITHMS &
  typeof ERROR_DIFFUSION_MATRIXES);

// TODO add a util to serialize Layers to JSON :3
export type Layer = {
  id: string;
  dithering: {
    cache: boolean;
    config: ColorDistanceOptions;
    method?: DitheringMethod | DiffusionMatrix;
    pallete: Array<[Color, Color]>;
  };
  src: HTMLImageElement;
  // TODO set defaults for everything
  transformations: {
    backgroundColor?: Color;
    blendMode: GlobalCompositeOperation;
    dimensions?: Dimensions;
    offset?: number | Point;
    opacity: number;
    rotation?: number;
    scale?: number | Point;
    translate?: Point;
  };
};

export const DEFAULT_LAYER_FACTORY: () => Omit<Layer, "id" | "src"> = () => {
  const methods = Object.keys(COLOR_PROCESSING_ALGORITHMS).concat(
    Object.keys(ERROR_DIFFUSION_MATRIXES)
  ) as
    | KeysOf<typeof COLOR_PROCESSING_ALGORITHMS>
    | KeysOf<typeof ERROR_DIFFUSION_MATRIXES>;

  const defaultPalletes = {
    black_and_white: [
      [{ ...BLACK }, { ...BLACK }],
      [{ ...WHITE }, { ...WHITE }],
    ],
    rgb: [
      [{ ...RED }, { ...RED }],
      [{ ...GREEN }, { ...GREEN }],
      [{ ...BLUE }, { ...BLUE }],
    ],
  };

  const palletes = Object.keys(defaultPalletes) as KeysOf<
    typeof defaultPalletes
  >;

  const palleteName = palletes[floor(Math.random() * palletes.length)];
  const pallete = defaultPalletes[palleteName].map(([from, to]) => [
    from,
    to,
  ]) as [Color, Color][];

  if (round(Math.random())) {
    const index = floor(random(0, pallete.length - 1));
    pallete[index] = [pallete[index][0], { ...TRANSPARENT }];
  }

  const methodIndex = round(Math.random() * methods.length);
  const method =
    methodIndex === methods.length ? undefined : methods[methodIndex];

  return {
    dithering: {
      cache: true,
      config: {
        colorSpace: "RGB",
      },
      pallete,
      method,
    },
    loading: false,
    transformations: {
      blendMode: "source-over",
      opacity: 100,
    },
  };
};
