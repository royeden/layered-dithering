import { Layer } from "../constants/layers";
import { Dimensions } from "../constants/math";
import type { ColorSpace } from "./color";
import { dither } from "./dithering";
import { createImage } from "./image";
import { ceil } from "./math";

export type ImageCache = {
  [id: string]: { [key: string]: HTMLImageElement };
};

export function getDitherLayerCacheKey(dithering: Layer["dithering"]) {
  return `${
    Array.isArray(dithering.method)
      ? dithering.method.map(
          ({ factor, offset }) => `${factor}—${offset.join("_")}`
        )
      : dithering.method ?? "none"
  }—${(dithering.config.colorSpace ?? "sRGB") as ColorSpace}—${
    dithering.config.ignoreAlphas ? "ignore-alphas" : "include-alphas"
  }—${dithering.pallete
    .map(([from, to]) => `${from.hex}_${to.hex}`)
    .join("—")}`;
}

export async function ditherLayer(
  { dithering, id, src }: Layer,
  cache: ImageCache
): Promise<HTMLImageElement> {
  const cacheKey = getDitherLayerCacheKey(dithering);

  const cachedImage = dithering.cache && cache?.[id]?.[cacheKey];

  if (cachedImage) {
    return cachedImage;
  } else {
    const canvas = document.createElement("canvas");
    canvas.width = src.width;
    canvas.height = src.height;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.drawImage(src, 0, 0);
    const imageData = context.getImageData(0, 0, src.width, src.height);
    context.putImageData(dither(imageData, dithering), 0, 0);
    const url = canvas.toDataURL("image/png");
    return (cache[id][cacheKey] = await createImage(url));
  }
}

export function getLayerTransformations(
  transformations: Layer["transformations"]
) {
  const {
    backgroundColor,
    blendMode,
    dimensions,
    offset = 0,
    opacity = 100,
    rotation,
    scale,
    translate,
  } = transformations;
  const [offsetX, offsetY] = Array.isArray(offset) ? offset : [offset, offset];
  const [scaleX, scaleY] = Array.isArray(scale)
    ? scale
    : [scale ?? 1, scale ?? 1];
  return {
    backgroundColor,
    blendMode,
    dimensions,
    offset,
    offsetX,
    offsetY,
    opacity,
    rotation,
    scale,
    scaleX,
    scaleY,
    translate,
  };
}

export function getTransformLayersCacheKey(
  transformations: ReturnType<typeof getLayerTransformations>,
  layer: Layer
) {
  return `${getDitherLayerCacheKey(layer.dithering)}—${
    transformations.backgroundColor?.hex ?? "transparent"
  }—${transformations.blendMode}—${
    transformations.dimensions?.width ?? "default-width"
  }_${transformations.dimensions?.height ?? "default-height"}—${
    transformations.offsetX
  }_${transformations.offsetY}—${transformations.opacity}—${
    transformations.rotation ?? 0
  }—${transformations.scaleX}_${transformations.scaleY}—${
    transformations.translate?.join?.("_") ?? "none"
  }`;
}

export async function transformLayers(
  layers: Layer[],
  cache: ImageCache,
  dimensions: Dimensions
): Promise<HTMLImageElement> {
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const transformations = getLayerTransformations(layer.transformations);
    const cacheKey = getTransformLayersCacheKey(transformations, layer);
    const cachedImage = cache?.[layer.id]?.[cacheKey];
    if (cachedImage) {
      context.globalCompositeOperation = transformations.blendMode;
      context.drawImage(cachedImage, 0, 0);
    } else {
      const image = await ditherLayer(layer, cache);
      const { width, height } = transformations.dimensions ?? image;
      const prevLayer = context.getImageData(0, 0, canvas.width, canvas.height);
      context.save();
      if (transformations.backgroundColor) {
        context.fillStyle = transformations.backgroundColor.hex;
        context.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        context.clearRect(0, 0, width, height);
      }
      context.globalAlpha = transformations.opacity / 100;
      context.drawImage(
        image,
        transformations.offsetX,
        transformations.offsetY,
        width,
        height
      );
      if (transformations.rotation) {
        context.save();
        context.translate(ceil(width / 2), ceil(height / 2));
        context.rotate(transformations.rotation);
        context.restore();
      }
      if (transformations.scale) {
        context.save();
        context.scale(transformations.scaleX, transformations.scaleY);
        context.restore();
      }
      if (transformations.translate) {
        context.save();
        context.translate(...transformations.translate);
        context.restore();
      }
      const url = canvas.toDataURL("image/png");
      cache[layer.id][cacheKey] = await createImage(url);
      context.restore();
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.putImageData(prevLayer, 0, 0);
      context.globalCompositeOperation = transformations.blendMode;
      context.drawImage(cache[layer.id][cacheKey], 0, 0);
    }
  }
  const url = canvas.toDataURL("image/png");
  return createImage(url);
}
