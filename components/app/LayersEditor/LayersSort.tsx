import useToggle from "../../../lib/hooks/useToggle";
import { useDeviceContext } from "../../context/DeviceContext";
import { useLayersContext } from "../../context/LayersContext";
import DraggableSort from "../../UI/DraggableSort";
import ScrollArea from "../../UI/ScrollArea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../UI/Tooltip";
import LayerPopoverContainer from "./LayerPopoverContainer";

export interface LayersSortProps {}

// TODO check for mobile & use a dialog instead of a popover in mobile
export default function LayersSort(props: LayersSortProps) {
  const { layers, setLayers } = useLayersContext();

  const { isMobile } = useDeviceContext();

  const [popoverOpen, togglePopoverOpen] = useToggle();
  const [tooltipOpen, toggleTooltipOpen] = useToggle();

  return (
    <ScrollArea
      containerClassName="max-h-full grow flex"
      className="min-h-full grow p-1 pl-3"
    >
      <Tooltip
        open={!popoverOpen && layers.length > 1 && (tooltipOpen || isMobile)}
        onOpenChange={toggleTooltipOpen}
      >
        <TooltipTrigger className="min-h-full w-full" asChild>
          <DraggableSort
            className="space-y-4"
            keyExtractor={(layer) => layer.id}
            items={layers}
            onSort={setLayers}
          >
            {(layer, index) => (
              <LayerPopoverContainer
                index={index}
                layer={layer}
                onOpenChange={togglePopoverOpen}
              />
            )}
          </DraggableSort>
        </TooltipTrigger>
        <TooltipContent>
          Drag and drop {!isMobile && "or use the arrow keys"} to sort the
          items...
        </TooltipContent>
      </Tooltip>
    </ScrollArea>
  );
}
