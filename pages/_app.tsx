import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LazyMotion } from "framer-motion";
import Layout from "../components/Layout";

// Make sure to return the specific export containing the feature bundle.
const loadFeatures = () =>
  import("../lib/constants/framer-motion-features").then((res) => {
    console.log("Loaded motion!");

    return res.default;
  });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // TODO add strict when Reorder supports LazyMotion
    <Layout>
      <LazyMotion features={loadFeatures}>
        <Component {...pageProps} />
      </LazyMotion>
    </Layout>
  );
}

export default MyApp;
