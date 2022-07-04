import { useDeviceContext } from "../../context/DeviceContext";
import { useLayersContext } from "../../context/LayersContext";
import DraggableSort from "../../UI/DraggableSort";
import ScrollArea from "../../UI/ScrollArea";
// import LayerDialogForm from "./LayerDialogForm";
import LayerPopoverForm from "./LayerPopoverForm";

export interface LayersSortProps {}

// TODO check for mobile & use a dialog instead of a popover in mobile
export default function LayersSort(props: LayersSortProps) {
  const { layers, setLayers } = useLayersContext();

  const { isMobile } = useDeviceContext();

  // const LayerFormComponent = isMobile ? LayerDialogForm : LayerPopoverForm;
  const LayerFormComponent = LayerPopoverForm;

  return (
    <div className="space-y-2">
      {layers.length > 1 && (
        <p className="text-center text-sm italic">
          Drag &amp; drop {!isMobile && "or use the arrow keys"} to sort the
          items
        </p>
      )}
      <ScrollArea
        containerClassName="max-h-full grow flex"
        className="min-h-full grow p-1"
      >
        <DraggableSort
          className="space-y-4"
          keyExtractor={(layer) => layer.id}
          items={layers}
          onSort={setLayers}
        >
          {(layer, index) => <LayerFormComponent index={index} layer={layer} />}
        </DraggableSort>
      </ScrollArea>
    </div>
  );
}
