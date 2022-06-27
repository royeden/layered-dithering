import type { Point } from "./math";

export type DiffusionMatrix = Array<{
  factor: number;
  offset: Point;
}>;

const ATKINSON: DiffusionMatrix = [
  { offset: [1, 0], factor: 1 / 8 },
  { offset: [2, 0], factor: 1 / 8 },
  { offset: [-1, 1], factor: 1 / 8 },
  { offset: [0, 1], factor: 1 / 8 },
  { offset: [1, 1], factor: 1 / 8 },
  { offset: [0, 2], factor: 1 / 8 },
];

const FLOYD_STEINBERG: DiffusionMatrix = [
  { offset: [1, 0], factor: 7 / 16 },
  { offset: [-1, 1], factor: 3 / 16 },
  { offset: [0, 1], factor: 5 / 16 },
  { offset: [1, 1], factor: 1 / 16 },
];

const FALSE_FLOYD_STEINBERG: DiffusionMatrix = [
  { offset: [1, 0], factor: 3 / 8 },
  { offset: [0, 1], factor: 3 / 8 },
  { offset: [1, 1], factor: 2 / 8 },
];

const JARVIS: DiffusionMatrix = [
  { offset: [1, 0], factor: 7 / 48 },
  { offset: [2, 0], factor: 5 / 48 },

  { offset: [-2, 1], factor: 3 / 48 },
  { offset: [-1, 1], factor: 5 / 48 },
  { offset: [0, 1], factor: 7 / 48 },
  { offset: [1, 1], factor: 5 / 48 },
  { offset: [2, 1], factor: 3 / 48 },

  { offset: [-2, 2], factor: 1 / 48 },
  { offset: [-1, 2], factor: 3 / 48 },
  { offset: [0, 2], factor: 4 / 48 },
  { offset: [1, 2], factor: 3 / 48 },
  { offset: [2, 2], factor: 1 / 48 },
];

const STUCKI: DiffusionMatrix = [
  { offset: [1, 0], factor: 8 / 42 },
  { offset: [2, 0], factor: 4 / 42 },

  { offset: [-2, 1], factor: 2 / 42 },
  { offset: [-1, 1], factor: 4 / 42 },
  { offset: [0, 1], factor: 8 / 42 },
  { offset: [1, 1], factor: 4 / 42 },
  { offset: [2, 1], factor: 2 / 42 },

  { offset: [-2, 2], factor: 1 / 42 },
  { offset: [-1, 2], factor: 2 / 42 },
  { offset: [0, 2], factor: 4 / 42 },
  { offset: [1, 2], factor: 2 / 42 },
  { offset: [2, 2], factor: 1 / 42 },
];

const BURKES: DiffusionMatrix = [
  { offset: [1, 0], factor: 8 / 32 },
  { offset: [2, 0], factor: 4 / 32 },

  { offset: [-2, 1], factor: 2 / 32 },
  { offset: [-1, 1], factor: 4 / 32 },
  { offset: [0, 1], factor: 8 / 32 },
  { offset: [1, 1], factor: 4 / 32 },
  { offset: [2, 1], factor: 2 / 32 },
];

const SIERRA_3: DiffusionMatrix = [
  { offset: [1, 0], factor: 5 / 32 },
  { offset: [2, 0], factor: 3 / 32 },

  { offset: [-2, 1], factor: 2 / 32 },
  { offset: [-1, 1], factor: 4 / 32 },
  { offset: [0, 1], factor: 5 / 32 },
  { offset: [1, 1], factor: 4 / 32 },
  { offset: [2, 1], factor: 2 / 32 },

  { offset: [-1, 2], factor: 2 / 32 },
  { offset: [0, 2], factor: 3 / 32 },
  { offset: [1, 2], factor: 2 / 32 },
];

const SIERRA_2: DiffusionMatrix = [
  { offset: [1, 0], factor: 4 / 16 },
  { offset: [2, 0], factor: 3 / 16 },

  { offset: [-2, 1], factor: 1 / 16 },
  { offset: [-1, 1], factor: 2 / 16 },
  { offset: [0, 1], factor: 3 / 16 },
  { offset: [1, 1], factor: 2 / 16 },
  { offset: [2, 1], factor: 1 / 16 },
];

const SIERRA_2_4A: DiffusionMatrix = [
  { offset: [1, 0], factor: 2 / 4 },
  { offset: [-2, 1], factor: 1 / 4 },
  { offset: [-1, 1], factor: 1 / 4 },
];

export const ERROR_DIFFUSION_MATRIXES = {
  ATKINSON,
  FLOYD_STEINBERG,
  FALSE_FLOYD_STEINBERG,
  JARVIS,
  STUCKI,
  BURKES,
  SIERRA_3,
  SIERRA_2,
  SIERRA_2_4A,
};

// export type Matrix<T> = T[][];
// export function createEmptyMatrix<T>(width: number, height: number): Matrix<T> {
//   if (width < 1 || height < 1 || ~~width !== width || ~~height !== height)
//     throw new Error('Please provide valid values to create an empty matrix!');
//   return Array(width).fill(Array(height).fill(0));
// }

// export type ExtractedMatrix<T> = [
//   extractedMatrix: T[],
//   width: number,
//   height: number
//   // original: Matrix<T>
// ];
// export function extractMatrix<T>(matrix: Matrix<T>): ExtractedMatrix<T> {
//   if (!matrix?.[0]?.length) throw new Error('Please provide a valid matrix to extract!');
//   const width = matrix.length;
//   const height = matrix[0].length;
//   return [matrix.flat(), width, height /*, matrix*/];
// }

// https://github.com/ShadowfaxRodeo/dither-me-this
// What a smart and hacky way to solve bit reversing, interleaving, etc.
// const bigMatrix = [
//   [0, 48, 12, 60, 3, 51, 15, 63],
//   [32, 16, 44, 28, 35, 19, 47, 31],
//   [8, 56, 4, 52, 11, 59, 7, 55],
//   [40, 24, 36, 20, 43, 27, 39, 32],
//   [2, 50, 14, 62, 1, 49, 13, 61],
//   [34, 18, 46, 30, 33, 17, 45, 29],
//   [10, 58, 6, 54, 9, 57, 5, 53],
//   [42, 26, 38, 22, 41, 25, 37, 21]
// ];

// TODO this should be extracted to a generator with the generic math expression
// function createBayerMatrix(size: number | [width: number, height: number]): Matrix<number> {
//   let [width, height] = Array.isArray(size) ? size : [size, size];

//   width = Math.min(width, 8);
//   height = Math.min(height, 8);

//   if (width === 8 && height === 8) {
//     // If we're using an 8 by 8 matrix just return the big matrix
//     // This returns a new copy of the big matrix
//     return bigMatrix.map((row) => row.slice(0));
//   }

//   const matrix = createEmptyMatrix<number>(width, height);

//   for (let x = 0; x < width; x++) {
//     for (let y = 0; y < height; y++) {
//       matrix[x][y] = bigMatrix[x][y];
//     }
//   }

//   const indexes = matrix
//     .flat()
//     .sort((a, b) => a - b)
//     .reduce((dict, weight, index) => (dict[weight] = index), {});

//   for (let x = 0; x < width; x++) {
//     for (let y = 0; y < height; y++) {
//       matrix[x][y] = indexes[matrix[x][y]];
//     }
//   }

//   return matrix;
// }
