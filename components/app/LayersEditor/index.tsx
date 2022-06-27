import { HTMLAttributes } from "react";
import { DEFAULT_LAYER_FACTORY } from "../../../lib/constants/layers";
import classNames from "../../../lib/utils/classNames";
import { useLayersContext } from "../../context/LayersContext";
import Card from "../../UI/Card";
import LayerButton from "./LayerButton";
import LayersSort from "./LayersSort";

export interface LayersEditorProps extends HTMLAttributes<HTMLDivElement> {}

export default function LayersEditor({
  className,
  ...props
}: LayersEditorProps) {
  const { addLayer, layers } = useLayersContext();

  return layers.length ? (
    <Card
      className={classNames(
        "flex w-full flex-col space-y-10 lg:max-w-sm",
        className
      )}
      {...props}
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Layers</h1>
        <small className="text-xs">
          *Layers are processed from top to bottom
        </small>
      </div>
      <LayersSort />
      <LayerButton
        onClick={() =>
          addLayer(
            Object.assign(DEFAULT_LAYER_FACTORY(), {
              // TODO add src per layer
              src: layers?.[0]?.src,
            })
          )
        }
      >
        Add layer
      </LayerButton>
    </Card>
  ) : null;
}
