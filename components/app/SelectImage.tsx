import { DEFAULT_LAYER_FACTORY } from "../../lib/constants/layers";
import useToggle from "../../lib/hooks/useToggle";
import { createImage, resizeImage } from "../../lib/utils/image";
import { useDeviceContext } from "../context/DeviceContext";
import { useLayersContext } from "../context/LayersContext";
import Card from "../UI/Card";
import FileInput from "../UI/FileInput";
import Spinner from "../UI/Spinner";

export interface SelectImageProps {}

export default function SelectImage(props: SelectImageProps) {
  const { addLayer, layers } = useLayersContext();

  const [loading, toggleLoading] = useToggle(false);
  const handleChange = async (file: File) => {
    toggleLoading(true);
    const url = URL.createObjectURL(file);
    const image = await createImage(url);
    const resized = await resizeImage(image, 640);
    addLayer(Object.assign(DEFAULT_LAYER_FACTORY(), { src: resized }));
    toggleLoading(false);
    URL.revokeObjectURL(url);
  };

  const { isMobile } = useDeviceContext();

  return !layers.length ? (
    <div className="flex h-full w-full items-center justify-center py-20 px-4">
      <Card className="w-full max-w-sm space-y-2 rounded-lg md:max-w-lg">
        <h1 className="text-center text-2xl font-bold">Welcome to the app</h1>
        <div className="space-y-4">
          <p>
            This app allow you to dither images in layers in order to produce
            interesting results...
          </p>
          <p className="w-full text-center">Let&apos;s try it out 😃</p>
          <div>
            {loading ? (
              <Spinner />
            ) : (
              <FileInput
                accept="image/*"
                name="src"
                onChange={(file) => handleChange(file as File)}
                onError={console.error}
              >
                {(dragOver) => (
                  <p>
                    {dragOver
                      ? "Drop here!"
                      : isMobile
                      ? "Click here to add a file to get started!"
                      : "Drag and drop or click here to add a file to get started!"}
                  </p>
                )}
              </FileInput>
            )}
          </div>
        </div>
      </Card>
    </div>
  ) : null;
}
