import { createContext, ReactNode, useContext } from "react";
import useWindowSize from "../../lib/hooks/useWindowSize";
import { getBreakpointsFor } from "../../lib/utils/tailwind-helpers";

export const WindowSizeContext = createContext<
  ReturnType<typeof getBreakpointsFor> & ReturnType<typeof useWindowSize>
>(null!);

const { Provider } = WindowSizeContext;

export interface WindowSizeProviderProps {
  children: ReactNode;
}

export const useWindowSizeContext = () => useContext(WindowSizeContext);

export default function WindowSizeProvider({
  children,
}: WindowSizeProviderProps) {
  const { width, height } = useWindowSize();
  const breakpoints = getBreakpointsFor(width ?? 0);
  return (
    <Provider
      value={{
        width,
        height,
        ...breakpoints,
      }}
    >
      {children}
    </Provider>
  );
}
