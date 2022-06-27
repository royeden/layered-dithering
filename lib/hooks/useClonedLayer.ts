import { useState } from "react";
import { Layer } from "../constants/layers";
import { deepCopy } from "../utils/types";

type ClonedLayerUpdate = Partial<{
  dithering: Partial<Layer["dithering"]>;
  transformations: Partial<Layer["transformations"]>;
}>;

export default function useClonedLayer(layer: Layer) {
  const [clonedLayer, setClonedLayer] = useState({
    ...deepCopy(layer),
    src: layer.src,
  });

  const updateClonedLayer = (
    partial: ClonedLayerUpdate | ((prevClonedLayer: Layer) => ClonedLayerUpdate)
  ) => {
    setClonedLayer((prevClonedLayer) => {
      const partialValue: ClonedLayerUpdate =
        typeof partial === "function" ? partial(prevClonedLayer) : partial;
      const key = Object.keys(partialValue)[0] as
        | "dithering"
        | "transformations";
      const value = partialValue[key];
      return {
        ...prevClonedLayer,
        [key]: {
          ...prevClonedLayer[key],
          ...value,
        },
        src: layer.src,
      } as Layer;
    });
  };

  return [clonedLayer, updateClonedLayer] as const;
}
