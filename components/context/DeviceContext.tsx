import { createContext, ReactNode, useContext } from "react";
import { DEVICE, IDevice } from "ua-parser-js";

export const DeviceContext = createContext<{
  isMobile: boolean;
}>(null!);

const { Provider } = DeviceContext;

export interface DeviceProviderProps {
  children: ReactNode;
  device: IDevice["type"];
}

export const useDeviceContext = () => useContext(DeviceContext);

export default function DeviceProvider({
  children,
  device,
}: DeviceProviderProps) {
  return (
    <Provider
      value={{
        isMobile: DEVICE.MOBILE === device,
      }}
    >
      {children}
    </Provider>
  );
}
