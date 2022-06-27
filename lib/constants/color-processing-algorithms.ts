import {
  Color,
  ColorDistanceOptions,
  createColor,
  findClosestColorInPallete,
  GenericColorVector,
} from "../utils/color";
import { setPixelColor } from "../utils/image";
import { random } from "../utils/math";
import { WHITE } from "./colors";
import type { DiffusionMatrix } from "./diffusion-matrixes";

type DitheringAlgorithmOptions = {
  config: ColorDistanceOptions;
  imageData: ImageData;
  pallete: Color[];
  pixelColor: Color;
  pixelIndex: number;
};

export type DitheringAlgorithm = (options: DitheringAlgorithmOptions) => Color;

const THRESHOLD: DitheringAlgorithm = ({ pallete, pixelColor, config }) =>
  findClosestColorInPallete(pallete, pixelColor, config);

const NOISE_FILTER: DitheringAlgorithm = ({ pallete }) =>
  pallete[random(0, pallete.length - 1)];

const RANDOM_FILTER: DitheringAlgorithm = ({ pallete, pixelColor, config }) => {
  const color = pallete[random(0, pallete.length - 1)];

  const colorToWhite = color.distanceTo(WHITE, config);
  const pixelColorToWhite = pixelColor.distanceTo(WHITE, config);
  const randomToWhite = createColor(
    WHITE.rgba.map(() => random(0, 255)) as GenericColorVector
  ).distanceTo(WHITE, config);
  const bright = colorToWhite < pixelColorToWhite ? color : pixelColor;
  const dark = colorToWhite < pixelColorToWhite ? pixelColor : color;

  return pixelColorToWhite < randomToWhite ? dark : bright;
};

// TODO revise
// const bayerThresholdMatrix: DitheringAlgorithm = ({
//   imageData,
//   pallete,
//   pixelColor,
//   pixelIndex
// }) => {
//   // TODO map pixelColor variable
//   // const pixelColor = [PixelOffsets.r, PixelOffsets.g, PixelOffsets.b].map(
//   //   (offset) => imageData.data[pixelIndex + offset] // + thresholdMatrix[]
//   // ) as Color;

//   const color = findClosestColorInPallete(pallete, pixelColor);

//   setPixelColor(imageData, pixelIndex, color);

//   return color;
// };

// https://github.com/ShadowfaxRodeo/dither-me-this/blob/main/src/data/diffusion-maps.js

export const COLOR_PROCESSING_ALGORITHMS = {
  THRESHOLD,
  RANDOM_FILTER,
  NOISE_FILTER,
  // bayerThresholdMatrix
};

export function distributeErrorByMatrix(
  errorVector: GenericColorVector,
  diffusionMatrix: DiffusionMatrix,
  imageData: ImageData,
  pixelIndex: number
) {
  for (let index = 0; index < diffusionMatrix.length; index++) {
    const diffusion = diffusionMatrix[index];
    const currentPixelIndex =
      pixelIndex +
      (diffusion.offset[0] + diffusion.offset[1] * imageData.width) * 4;
    if (imageData.data[currentPixelIndex]) {
      const color = createColor(
        errorVector.map((component, offset) =>
          Math.max(
            0,
            Math.min(
              255,
              imageData.data[currentPixelIndex + offset] +
                component * diffusion.factor
            )
          )
        ) as GenericColorVector
      );
      setPixelColor(imageData.data, currentPixelIndex, color);
    }
  }
}
