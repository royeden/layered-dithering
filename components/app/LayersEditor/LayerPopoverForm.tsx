import { PopoverProps } from "@radix-ui/react-popover";
import Image from "next/image";
import { Layer } from "../../../lib/constants/layers";
import classNames from "../../../lib/utils/classNames";
import { useLayersContext } from "../../context/LayersContext";
import { useWindowSizeContext } from "../../context/WindowSizeContext";
import Button from "../../UI/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../../UI/Popover";
import ScrollArea from "../../UI/ScrollArea";
import LayerButton from "./LayerButton";
import LayerForm from "./LayerForm";

export interface LayerPopoverFormProps extends PopoverProps {
  index: number;
  layer: Layer;
}

export default function LayerPopoverForm({
  index,
  layer,
  ...props
}: LayerPopoverFormProps) {
  const { getDitheredLayerPreview, removeLayer } = useLayersContext();

  const { lg } = useWindowSizeContext();

  const preview = getDitheredLayerPreview(layer);

  const portrait = layer.src.height > layer.src.width;
  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <LayerButton>
          Layer {layer.id} #{index + 1}
        </LayerButton>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 min-w-full grow sm:w-96 md:max-w-lg"
        side={lg ? "right" : "top"}
      >
        <div className="space-y-2">
          <ScrollArea
            containerClassName="w-full grow"
            className="max-h-48 w-full md:max-h-96"
          >
            <div
              className={classNames("flex w-full p-1", {
                "flex-col space-y-2 md:space-y-4": !portrait,
                "space-x-2 md:space-x-4": portrait,
              })}
            >
              <div className="flex w-full flex-col">
                <div className="sticky top-0">
                  <p>Preview:</p>
                  <div
                    className="w-full"
                    style={{
                      backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><rect x="8" width="8" height="8"/><rect y="8" width="8" height="8"/></svg>')`,
                    }}
                  >
                    {preview && (
                      <Image
                        objectFit="contain"
                        alt={`Layer ${layer.id} preview`}
                        layout="responsive"
                        style={{
                          opacity: layer.transformations.opacity / 100,
                        }}
                        src={preview.src}
                        width={preview.width}
                        height={preview.height}
                      />
                    )}
                  </div>
                </div>
              </div>
              <LayerForm
                autoupdate={true}
                className={classNames(portrait ? "w-1/2" : "h-1/2", "shrink-0")}
                layer={layer}
              />
            </div>
          </ScrollArea>
          <div className="flex w-full justify-center">
            <Button
              onClick={() => removeLayer(layer.id)}
              size="sm"
              theme="danger"
            >
              Remove
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
