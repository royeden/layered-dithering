// Some code here is inspired by https://github.com/Vibrant-Colors/node-vibrant/blob/master/src/util.ts

import { round } from "./math";
import { compare, KeysOf } from "./types";

// Either RGB, HSL, XYZ, etc.
export type ColorVector = [number, number, number];
export type ColorVectorAlpha = [number, number, number, number];

export type GenericColorVector = ColorVector | ColorVectorAlpha;

export type GenericColor = GenericColorVector | string;

export type ColorSpace = "RGB" | "sRGB" | "Redmean" | "CIELab";

function checkColorComponent(component: number): number {
  if (component < 0 || component > 255)
    throw new Error(
      `Color component should be between 0 and 255, ${component} received`
    );
  return component;
}

export function extendToAlphaHexString(hex: string) {
  const hasHash = hex.includes("#");
  const hexCode = hex.substring(hasHash ? 1 : 0);

  return `#${(hexCode.length < 6
    ? hexCode[0] +
      hexCode[0] +
      hexCode[1] +
      hexCode[1] +
      hexCode[2] +
      hexCode[2] +
      (hexCode?.[3] ?? "") +
      (hexCode?.[3] ?? "")
    : hexCode
  ).padEnd(8, "f")}`.toUpperCase();
}

export function hexToRgba(hex: string): ColorVectorAlpha {
  try {
    return /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
      .exec(extendToAlphaHexString(hex))!
      .slice(1)
      .map((component) => parseInt(component, 16)) as ColorVectorAlpha;
  } catch (error) {
    throw new Error(`${hex} could not be converted to color`);
  }
}

export function rgbaToHex(color: GenericColorVector): string {
  return `#${color
    .map((component) => {
      checkColorComponent(component);
      return component.toString(16).padStart(2, "0");
    })
    .join("")}`;
}

export function rgbaToHsva(rgba: GenericColorVector): ColorVectorAlpha {
  const [r, g, b, a = 255] = rgba;
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);

  // prettier-ignore
  const hh = delta
    ? max === r
      ? (g - b) / delta
      : max === g
        ? 2 + (b - r) / delta
        : 4 + (r - g) / delta
    : 0;

  return [
    round(60 * (hh < 0 ? hh + 6 : hh)),
    round(max ? (delta / max) * 100 : 0),
    round((max / 255) * 100),
    a,
  ] as ColorVectorAlpha;
}

export function hsvaToRgba(hsva: GenericColorVector): ColorVectorAlpha {
  let [h, s, v, a = 255] = hsva;
  h = (h / 360) * 6;
  s = s / 100;
  v = v / 100;

  const hh = Math.floor(h),
    b = v * (1 - s),
    c = v * (1 - (h - hh) * s),
    d = v * (1 - (1 - h + hh) * s),
    index = hh % 6;

  return [
    round([v, c, b, b, d, v][index] * 255),
    round([d, v, v, c, b, b][index] * 255),
    round([b, b, d, v, v, c][index] * 255),
    a,
  ];
}

export function rgbaToHsla(rgba: GenericColorVector): ColorVectorAlpha {
  let [r, g, b, a = 255] = rgba;
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b);
  let cmax = Math.max(r, g, b);
  let delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  // Calculate hue
  if (delta === 0) {
    h = 0; // No difference
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6; // Red is max
  } else if (cmax === g) {
    h = (b - r) / delta + 2; // Green is max
  } else {
    h = (r - g) / delta + 4; // Blue is max
  }

  h = round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = round(s * 100);
  l = round(l * 100);

  return [h, s, l, a];
}

export function hslaToRgba(color: GenericColorVector): ColorVectorAlpha {
  let [h, s, l, a = 255] = color;

  s /= 100;
  l /= 100;

  const k = (n: number) => (n + h / 30) % 12;
  const angle = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - angle * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [round(255 * f(0)), round(255 * f(8)), round(255 * f(4)), a];
}

export function rgbToXyz(color: GenericColorVector): ColorVector {
  const [r, g, b] = (color.length === 3 ? color : color.slice(0, -1)).map(
    (component) => {
      const value = component / 255;
      return (
        (value > 0.04045
          ? Math.pow((component + 0.005) / 1.055, 2.4)
          : component / 12.92) * 100
      );
    }
  );

  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  return [x, y, z];
}

export function xyzToCIELab(color: GenericColorVector): ColorVector {
  // REF X 95.047
  // REF Y 100
  // REF Z 108.883
  const [x, y, z] = [95.047, 100, 108.883].map((ref, index) => {
    const value = color[index] / ref;
    return value > 0.008856 ? Math.pow(value, 1 / 3) : 7.787 * value + 16 / 116;
  });

  const L = 116 * y - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  return [L, a, b];
}

export type ColorDistanceOptions = {
  colorSpace?: ColorSpace;
  ignoreAlphas?: boolean;
  simplify?: boolean;
};

const sRGBMultipliers = [2, 4, 3];
const redmeanMultipliers = [
  (redmean: number) => 2 + redmean / 256,
  4,
  (redmean: number) => 2 + (255 - redmean) / 256,
];

export function findColorDistance(
  color1: Color,
  color2: Color,
  {
    simplify = true,
    colorSpace = "sRGB",
    ignoreAlphas = true,
  }: ColorDistanceOptions = {}
): number {
  let distance = 0;

  if (colorSpace === "CIELab") {
    // const WEIGHT_L = 1;
    // const WEIGHT_C = 1;
    // const WEIGHT_H = 1;

    const [L1, a1, b1] = xyzToCIELab(rgbToXyz(color1.rgb));
    const [L2, a2, b2] = xyzToCIELab(rgbToXyz(color2.rgb));
    const dL = L1 - L2;
    const da = a1 - a2;
    const db = b1 - b2;

    const xC1 = Math.sqrt(a1 * a1 + b1 * b1);
    const xC2 = Math.sqrt(a2 * a2 + b2 * b2);

    const xDL = L2 - L1;
    let xDC = xC2 - xC1;
    const xDE = Math.sqrt(dL * dL + da * da + db * db);

    let xDH =
      Math.sqrt(xDE) > Math.sqrt(Math.abs(xDL)) + Math.sqrt(Math.abs(xDC))
        ? Math.sqrt(xDE * xDE - xDL * xDL - xDC * xDC)
        : 0;

    const xSC = 1 + 0.045 * xC1;
    const xSH = 1 + 0.015 * xC1;

    // xDL /= WEIGHT_L;
    // xDC /= WEIGHT_C * xSC;
    // xDH /= WEIGHT_H * xSH;
    xDC /= xSC;
    xDH /= xSH;

    distance = xDL * xDL + xDC * xDC + xDH * xDH;
  } else {
    const multipliers =
      colorSpace === "sRGB"
        ? (color1.r + color2.r) / 2 >= 128
          ? sRGBMultipliers.slice().reverse()
          : sRGBMultipliers
        : colorSpace === "Redmean"
        ? redmeanMultipliers
        : undefined;

    for (let i = 0; i < (ignoreAlphas ? 3 : 4); i++) {
      const multiplier = multipliers?.[i] ?? 1;
      distance +=
        (typeof multiplier === "function"
          ? multiplier(color2.r - color1.r)
          : multiplier) *
        (color2.rgba[i] - color1.rgba[i]) ** 2;
    }
  }

  return simplify ? distance : Math.sqrt(distance);
}

export type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
  hex: string;
  rgb: ColorVector;
  rgba: ColorVectorAlpha;
  distanceTo: (otherColor: Color, options?: ColorDistanceOptions) => number;
  set: (newColor: GenericColor, newReference?: boolean) => Color;
  setComponent: (
    component: "r" | "g" | "b" | "a",
    value: number,
    newReference?: boolean
  ) => Color;
};

// Take advantage of scopes :D
export function createColor(color: GenericColor): Color {
  let scopedColor: Color;
  const distanceTo: Color["distanceTo"] = (otherColor, options) => {
    return findColorDistance(scopedColor, otherColor, options);
  };
  const setComponent: Color["setComponent"] = (
    component,
    value,
    newReference = false
  ) => {
    const { r, g, b, a } = Object.assign(
      {
        r: scopedColor.r,
        g: scopedColor.g,
        b: scopedColor.b,
        a: scopedColor.a,
      },
      {
        [component]: value,
      }
    );
    return set([r, g, b, a] as GenericColorVector, newReference);
  };
  const set: Color["set"] = (newColor, newReference = false) => {
    try {
      let r: number;
      let g: number;
      let b: number;
      let a: number;
      let hex: string;
      let rgb: ColorVector;
      let rgba: ColorVectorAlpha;
      if (typeof newColor === "string") {
        [r, g, b, a] = hexToRgba(newColor);
        hex = extendToAlphaHexString(newColor);
      } else {
        [r, g, b, a = 255] = newColor;
        hex = extendToAlphaHexString(rgbaToHex(newColor));
      }
      checkColorComponent(r);
      checkColorComponent(g);
      checkColorComponent(b);
      checkColorComponent(a);
      rgb = [r, g, b];
      rgba = rgb.concat(a) as ColorVectorAlpha;
      const createdColor = {
        r,
        g,
        b,
        a,
        rgb,
        rgba,
        hex,
        distanceTo,
        set,
        setComponent,
      };
      return newReference
        ? (scopedColor = createdColor)
        : Object.assign((scopedColor ??= {} as Color), createdColor);
    } catch (error) {
      throw new Error(
        `Cannot set ${
          typeof newColor === "string" ? newColor : newColor.join(", ")
        } as a color.\nThe following error has occurred: ${
          (error as Error).message
        }`
      );
    }
  };

  set(color);

  return scopedColor!;
}

export function findClosestColorInPallete(
  pallete: Color[],
  color: Color,
  options?: ColorDistanceOptions
): Color {
  if (!pallete.length)
    throw new Error(
      "This function expects a pallete that has at least one color"
    );
  let target = {
    distance: color.distanceTo(pallete[0], options),
    color: pallete[0],
  };
  for (let i = 1; i < pallete.length; i++) {
    const distance = color.distanceTo(pallete[i], options);
    if (distance < target.distance) {
      target = {
        distance,
        color: pallete[i],
      };
    }
  }
  return target.color;
}
