import Image from "next/image";
import { HTMLAttributes, useMemo } from "react";
import classNames from "../../lib/utils/classNames";
import { greatestCommonDenominator } from "../../lib/utils/math";
import { useLayersContext } from "../context/LayersContext";
import { useWindowSizeContext } from "../context/WindowSizeContext";
import Button from "../UI/Button";
import Spinner from "../UI/Spinner";

export interface ProcessedImageProps extends HTMLAttributes<HTMLDivElement> {
  containerClassName?: string;
}

export default function ProcessedImage({
  className,
  containerClassName,
  ...props
}: ProcessedImageProps) {
  const { layers, loading, processedImage } = useLayersContext();
  const { height } = useWindowSizeContext();

  const image = layers?.[0]?.src;

  const aspectRatioDenominator = useMemo(
    () =>
      image
        ? greatestCommonDenominator(image.naturalWidth, image.naturalHeight)
        : undefined,
    [image]
  );

  return image ? (
    <div
      className={classNames(
        containerClassName,
        "flex w-full select-none flex-col space-y-2 bg-white transition-colors duration-300 dark:bg-gray-800"
      )}
    >
      <div
        className={classNames(
          className,
          "flex w-full max-w-full grow items-center justify-center bg-gray-500"
        )}
        style={{
          backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><rect x="8" width="8" height="8"/><rect y="8" width="8" height="8"/></svg>')`,
        }}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            aspectRatio: aspectRatioDenominator
              ? `${image.naturalWidth / aspectRatioDenominator} / ${
                  image.naturalHeight / aspectRatioDenominator
                }`
              : undefined,
            maxHeight: Math.min(image?.naturalHeight ?? 0, (height ?? 0) / 2),
          }}
        >
          {loading ? (
            <Spinner className="h-8 w-8" />
          ) : processedImage ? (
            <div className="flex h-full w-full grow justify-center">
              {/* TODO add image compare */}
              <Image
                className="shrink"
                objectFit="contain"
                alt="Processed Image"
                src={processedImage}
                height={Math.min(
                  processedImage.naturalHeight ?? 0,
                  typeof window !== "undefined" ? window.innerHeight / 2 : 0
                )}
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex w-full items-center justify-center lg:h-14">
        {processedImage && (
          <Button as="a" href={processedImage.src} download="Result.png">
            Download
          </Button>
        )}
      </div>
    </div>
  ) : null;
}
