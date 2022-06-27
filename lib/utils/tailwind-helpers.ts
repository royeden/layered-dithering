import { KeysOf } from "./types";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type ParsedBreakpoints = Record<keyof typeof BREAKPOINTS, boolean>;

export function getBreakpointsFor(width: number = 0): ParsedBreakpoints {
  return (Object.keys(BREAKPOINTS) as KeysOf<typeof BREAKPOINTS>).reduce(
    (breakpoints, breakpoint) => {
      breakpoints[breakpoint] = width >= BREAKPOINTS[breakpoint];
      return breakpoints;
    },
    {} as ParsedBreakpoints
  );
}
