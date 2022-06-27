// TODO move this processing to a web worker
// https://vitejs.dev/guide/assets.html#importing-script-as-a-worker
// https://vitejs.dev/guide/features.html#web-workers
// https://developer.chrome.com/blog/offscreen-canvas/

import { getPixelColor, setPixelColor } from "./image";
import { Color, createColor, type GenericColorVector } from "./color";
import { Layer } from "../constants/layers";
import {
  COLOR_PROCESSING_ALGORITHMS,
  distributeErrorByMatrix,
  DitheringAlgorithm,
} from "../constants/color-processing-algorithms";
import { ERROR_DIFFUSION_MATRIXES } from "../constants/diffusion-matrixes";

// TODO perhaps consider generators, especially when using colors?
export function dither(imageData: ImageData, dithering: Layer["dithering"]) {
  if (dithering.method !== undefined) {
    const pallete: Color[] = [];
    const colors: { [key: string]: Color } = {};

    for (let i = 0; i < dithering.pallete.length; i++) {
      const [color, target] = dithering.pallete[i];
      pallete.push(color);
      colors[color.hex] = target;
    }

    const process: DitheringAlgorithm =
      Array.isArray(dithering.method) ||
      ERROR_DIFFUSION_MATRIXES[
        dithering.method as keyof typeof ERROR_DIFFUSION_MATRIXES
      ]
        ? COLOR_PROCESSING_ALGORITHMS.THRESHOLD
        : COLOR_PROCESSING_ALGORITHMS[
            dithering.method as keyof typeof COLOR_PROCESSING_ALGORITHMS
          ];

    const diffusionMatrix = Array.isArray(dithering.method)
      ? dithering.method
      : ERROR_DIFFUSION_MATRIXES[
          dithering.method as keyof typeof ERROR_DIFFUSION_MATRIXES
        ];

    for (
      let pixelIndex = 0;
      pixelIndex < imageData.data.length;
      pixelIndex += 4
    ) {
      const pixelColor = createColor(getPixelColor(imageData.data, pixelIndex));

      const color = process({
        config: dithering.config,
        imageData,
        pallete,
        pixelColor,
        pixelIndex,
      });

      if (!colors[color.hex] && dithering.method !== "RANDOM_FILTER")
        throw new Error(
          `Cannot convert ${color.hex} to any color of the pallete`
        );

      setPixelColor(imageData.data, pixelIndex, colors?.[color.hex] ?? color);

      if (diffusionMatrix) {
        distributeErrorByMatrix(
          pixelColor.rgba.map(
            (component, offset) => component - color.rgba[offset]
          ) as GenericColorVector,
          diffusionMatrix,
          imageData,
          pixelIndex
        );
      }
    }
  }

  return imageData;
}
