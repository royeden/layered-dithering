export default function parseFileType(file: File, accept: string) {
  const accepted = accept.split(",").map((mime) => mime.trim());
  const mime = file.type;
  const extension = `.${
    file.name.split(".")?.at(-1) ??
    file.name.split(".")?.[file.name.split(".").length - 1]
  }`;
  if (
    !accepted.some(
      (acceptedType) =>
        acceptedType === mime ||
        (acceptedType.startsWith(".") && acceptedType === extension) ||
        (acceptedType.endsWith("*") &&
          acceptedType.split("/")[0] === mime.split("/")[0])
    )
  ) {
    throw new Error(
      `Invalid file type for ${file.name}. Expected ${accept}, got ${file.type}`
    );
  }

  return false;
}
