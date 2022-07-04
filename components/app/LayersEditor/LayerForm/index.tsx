import { FormEventHandler, useMemo } from "react";
import { Layer } from "../../../../lib/constants/layers";
import { LayerUpdate } from "../../../../lib/hooks/useLayers";
import classNames from "../../../../lib/utils/classNames";
import { debounce } from "../../../../lib/utils/functions";
import { SetPartialStateAction } from "../../../../lib/utils/react";
import { useLayersContext } from "../../../context/LayersContext";
import LayerBlendMode from "./LayerBlendMode";
import LayerColors from "./LayerColors";
import LayerDitheringMethod from "./LayerDitheringMethod";
import LayerOpacity from "./LayerOpacity";

export interface LayerFormProps {
  autoupdate: boolean;
  className?: string;
  layer: Layer;
}

export default function LayerForm({
  autoupdate, // TODO re add this handle
  className,
  layer,
}: LayerFormProps) {
  const { updateLayer } = useLayersContext();

  const debouncedUpdateLayer = useMemo(
    () =>
      debounce(
        (updates: SetPartialStateAction<Layer, LayerUpdate>) =>
          updateLayer(layer.id, updates),
        150
      ),
    [layer.id, updateLayer]
  );

  return (
    <div className={classNames(className, "space-y-3")}>
      <LayerOpacity
        onChange={(opacity) =>
          debouncedUpdateLayer((prevLayer) => ({
            transformations: { ...prevLayer.transformations, opacity },
          }))
        }
        value={layer.transformations.opacity}
      />
      <LayerDitheringMethod
        onChange={(method) =>
          debouncedUpdateLayer((prevLayer) => ({
            dithering: { ...prevLayer.dithering, method },
          }))
        }
        value={layer.dithering.method}
      />
      <LayerBlendMode
        onChange={(blendMode) =>
          debouncedUpdateLayer((prevLayer) => ({
            transformations: { ...prevLayer.transformations, blendMode },
          }))
        }
        value={layer.transformations.blendMode}
      />
      <LayerColors
        onChange={(pallete) =>
          debouncedUpdateLayer((prevLayer) => ({
            dithering: { ...prevLayer.dithering, pallete },
          }))
        }
        value={layer.dithering.pallete}
      />
    </div>
  );
}
