import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import parser from "ua-parser-js";
import SelectImage from "../components/app/SelectImage";
import DeviceProvider from "../components/context/DeviceContext";
import LayersProvider from "../components/context/LayersContext";
import WindowSizeProvider from "../components/context/WindowSizeContext";

const LayersEditor = dynamic(() => import("../components/app/LayersEditor"), {
  ssr: false,
});

const ProcessedImage = dynamic(
  () => import("../components/app/ProcessedImage"),
  {
    ssr: false,
  }
);

interface Props {
  device?: string;
}

const App: NextPage<Props> = ({ device }) => {
  return (
    <DeviceProvider device={device}>
      <WindowSizeProvider>
        <LayersProvider>
          <Head>
            <title>App — Layered Dithering</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="flex w-full flex-1 flex-col">
            <SelectImage />
            <div className="flex max-h-full w-full flex-1 flex-col-reverse lg:flex-row">
              <LayersEditor className="min-h-full grow" />
              <ProcessedImage containerClassName="sticky top-0 py-2" />
            </div>
          </main>
        </LayersProvider>
      </WindowSizeProvider>
    </DeviceProvider>
  );
};

App.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  return {
    device: parser(userAgent).device.type,
  };
};

export default App;
