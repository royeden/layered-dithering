import { useEffect, useRef, useState } from "react";
import { useAsyncMemo } from "use-async-memo";
import { Layer } from "../constants/layers";
import {
  getDitherLayerCacheKey,
  getLayerTransformations,
  getTransformLayersCacheKey,
  ImageCache,
  transformLayers,
} from "../utils/layers";
import { SetPartialStateAction } from "../utils/react";

export type LayerUpdate = Partial<Omit<Layer, "id" | "src">>;

export default function useLayers() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [loading, setLoading] = useState(false);

  const cache = useRef<ImageCache>({});

  useEffect(() => {
    const cacheKeys = Object.keys(cache.current);
    if (cacheKeys.length !== layers.length) {
      cache.current = layers.reduce((newCache, layer) => {
        newCache[layer.id] = cacheKeys.includes(layer.id)
          ? cache.current[layer.id]
          : {};
        return newCache;
      }, {} as ImageCache);
    }
  }, [layers]);

  // TODO use web worker to process the canvas offscreen
  const processedImage = useAsyncMemo(async () => {
    if (typeof window !== "undefined" && layers.length) {
      if (
        layers.some(
          (layer) =>
            !cache.current?.[layer.id]?.[
              getTransformLayersCacheKey(
                getLayerTransformations(layer.transformations),
                layer
              )
            ]
        )
      ) {
        setLoading(true);
      }
      return new Promise<HTMLImageElement>((resolve) => {
        setTimeout(async () => {
          const { width, height } = layers?.[0]?.src ?? {
            width: 0,
            height: 0,
          };
          const processed = await transformLayers(
            layers.slice().reverse(),
            cache.current,
            {
              width,
              height,
            }
          );
          setLoading(false);
          return resolve(processed);
        }, 100);
      });
    }
    return undefined;
  }, [layers]);

  const addLayer = (layer: Omit<Layer, "id">) =>
    setLayers((prevLayers) =>
      prevLayers.concat(Object.assign(layer, { id: Date.now().toString() }))
    );

  const removeLayer = (id: Layer["id"]) =>
    setLayers((prevLayers) => prevLayers.filter((layer) => layer.id !== id));

  const updateLayer = (
    id: Layer["id"],
    update: SetPartialStateAction<Layer, LayerUpdate>
  ) =>
    setLayers((prevLayers) =>
      prevLayers.map((prevLayer) => {
        const layer = typeof update === "function" ? update(prevLayer) : update;
        return prevLayer.id === id
          ? {
              id,
              dithering: layer.dithering ?? prevLayer.dithering,
              src: prevLayer.src,
              transformations:
                layer.transformations ?? prevLayer.transformations,
            }
          : prevLayer;
      })
    );

  const getDitheredLayerPreview = (layer: Layer) =>
    cache.current?.[layer.id]?.[getDitherLayerCacheKey(layer.dithering)] as
      | HTMLImageElement
      | undefined;

  const getTransformedLayerPreview = (layer: Layer) =>
    cache.current?.[layer.id]?.[
      getTransformLayersCacheKey(
        getLayerTransformations(layer.transformations),
        layer
      )
    ] as HTMLImageElement | undefined;

  return {
    addLayer,
    getDitheredLayerPreview,
    getTransformedLayerPreview,
    layers,
    loading,
    processedImage,
    removeLayer,
    setLayers,
    updateLayer,
  };
}
