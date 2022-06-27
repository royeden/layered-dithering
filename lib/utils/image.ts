import {
  Color,
  createColor,
  type ColorDistanceOptions,
  type GenericColorVector,
} from "./color";
import { round } from "./math";

export const createImage: (src: string) => Promise<HTMLImageElement> = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    // if (process.env.NODE_ENV === "development") {
    // image.crossOrigin = "Anonymous";
    // }
    image.onload = () => {
      resolve(image);
    };
    image.onerror = (error) => reject(error);
    image.src = src;
  });

export const resizeImage: (
  image: HTMLImageElement,
  maxSize: number
) => Promise<HTMLImageElement> = async (image, maxSize) => {
  const { width, height } = image;
  const canvas = document.createElement("canvas");

  const landscape = width > height;

  const ratio = landscape ? width / height : height / width;

  const canvasWidth = landscape ? maxSize : maxSize / ratio;
  const canvasHeight = landscape ? maxSize / ratio : maxSize;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  context.drawImage(image, 0, 0, canvasWidth, canvasHeight);

  const src = canvas.toDataURL();

  const resized = await createImage(src);

  return resized;
};

export function getPixelColor(
  pixels: ImageData["data"],
  index: number,
  ignoreAlphas: ColorDistanceOptions["ignoreAlphas"] = true
): GenericColorVector {
  const color = [pixels[index], pixels[index + 1], pixels[index + 2]];
  return (
    ignoreAlphas ? color : color.concat(pixels[index + 3])
  ) as GenericColorVector;
}

export function setPixelColor(
  pixels: ImageData["data"],
  pixelIndex: number,
  color: Color
) {
  return color.rgba.map(
    (component, index) => (pixels[pixelIndex + index] = component)
  ) as GenericColorVector;
}

export function getMeanColor(
  pixels: ImageData["data"],
  ignoreAlphas: ColorDistanceOptions["ignoreAlphas"] = true
): Color {
  const rgb = ignoreAlphas ? [0, 0, 0] : [0, 0, 0, 0];
  for (let i = 0; i < pixels.length; i += 4) {
    getPixelColor(pixels, i, ignoreAlphas).forEach((component, index) => {
      rgb[index] += component;
    });
  }

  return createColor(
    rgb.map((component) =>
      round(component / (pixels.length / 4))
    ) as GenericColorVector
  );
}
