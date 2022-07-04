import { useState } from "react";
import { Layer } from "../../../../lib/constants/layers";
import { Slider } from "../../../UI/Slider";
import { LayerFormUpdate } from "./layer-form-types";

export interface LayerOpacityProps
  extends LayerFormUpdate<Layer["transformations"]["opacity"]> {}

export default function LayerOpacity({ onChange, value }: LayerOpacityProps) {
  const [opacity, setOpacity] = useState(value);
  return (
    <Slider
      label={"Opacity:"}
      max={100}
      min={0}
      name="opacity"
      onValueChange={([newOpacity]) => {
        setOpacity(newOpacity);
        onChange(newOpacity);
      }}
      value={[opacity]}
    />
  );
}
