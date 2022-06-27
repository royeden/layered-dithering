import { createContext, ReactNode, useContext } from "react";
import useLayers from "../../lib/hooks/useLayers";

export const LayersContext = createContext<ReturnType<typeof useLayers>>(null!);

const { Provider } = LayersContext;

export interface LayersProviderProps {
  children: ReactNode;
}

export const useLayersContext = () => useContext(LayersContext);

export default function LayersProvider({ children }: LayersProviderProps) {
  const contextValue = useLayers();

  return <Provider value={contextValue}>{children}</Provider>;
}
