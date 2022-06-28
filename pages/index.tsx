import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

const ACKNOWLEDGEMENTS = [
  {
    label: "Dither It (website)",
    href: "https://ditherit.com/",
  },
  {
    label: "Dither Me This (website)",
    href: "https://doodad.dev/dither-me-this/",
  },
  {
    label: "Dither Me This (library)",
    href: "https://github.com/ShadowfaxRodeo/dither-me-this",
  },
  {
    label:
      "Ditherpunk — The article I wish I had about monochrome image dithering (article)*",
    href: "https://surma.dev/things/ditherpunk/index.html",
  },
];

const LIBRARIES = [
  {
    label: "Framer Motion",
    href: "https://www.framer.com/motion/",
  },
  {
    label: "use-async-memo",
    href: "https://github.com/awmleer/use-async-memo",
  },
  {
    label: "Radix Icons",
    href: "https://icons.radix-ui.com/",
  },
  {
    label: "Radix UI",
    href: "https://www.radix-ui.com/",
  },
  {
    label: "Tailwind Radix",
    href: "https://tailwindcss-radix.vercel.app/",
  },
  {
    label: "clsx *",
    href: "https://github.com/lukeed/clsx",
  },
  {
    label: "image-q **",
    href: "https://github.com/ibezkrovnyi/image-quantization",
  },
  {
    label: "React Colorful ***",
    href: "https://github.com/royeden/react-colorful/tree/merge-all-pending-prs-dist",
  },
];

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Home — Layered Dithering</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col py-6 px-6 md:items-center">
        <Card className="flex h-full max-w-lg flex-col items-center space-y-6 rounded-lg">
          <h1 className="text-center text-6xl font-bold text-gray-800 dark:text-white">
            Layered Dithering
          </h1>

          <section id="acknowledgements" className="space-y-4">
            <p className="text-center sm:text-center">
              This app wouldn&apos;t be possible without these projects and
              articles that were used as inspiration:
            </p>
            <article className="flex w-full flex-wrap justify-center rounded-md bg-gray-100 p-4 dark:bg-gray-700">
              {ACKNOWLEDGEMENTS.map(({ label, href }) => (
                <Button
                  key={href}
                  as="a"
                  className="underline"
                  external
                  href={href}
                  size="sm"
                  theme="transparent"
                >
                  {label}
                </Button>
              ))}
              <div className="mt-2 flex flex-col space-y-2">
                <small className="text-sm">
                  * Got this one from the{" "}
                  <Button
                    as="a"
                    className="py-1 px-0.5 underline"
                    external
                    href="https://ditherit.com/resources/"
                    size="none"
                    theme="none"
                  >
                    resources of Dither It
                  </Button>
                  .
                </small>
              </div>
            </article>
            <p className="text-center sm:text-center">
              And these awesome component libraries as well:
            </p>
            <article className="flex w-full flex-wrap justify-center rounded-md bg-gray-100 p-4 dark:bg-gray-700">
              {LIBRARIES.map(({ label, href }) => (
                <Button
                  key={href}
                  as="a"
                  className="underline"
                  external
                  href={href}
                  size="sm"
                  theme="transparent"
                >
                  {label}
                </Button>
              ))}
              <div className="mt-2 flex flex-col space-y-2">
                <small className="text-sm">
                  * Ported with some fixes from{" "}
                  <Button
                    as="a"
                    className="underline"
                    external
                    href="https://github.com/XaveScor/clsx/tree/smaller-size"
                    size="none"
                    theme="transparent"
                  >
                    this fork
                  </Button>
                  and
                  <Button
                    as="a"
                    className="underline"
                    external
                    href="https://github.com/rokoroku/clsx/tree/patch-1"
                    size="none"
                    theme="transparent"
                  >
                    this one
                  </Button>
                </small>
                <small className="text-sm">
                  ** To be implemented in the near future! (their code is much
                  better than mine and it works much faster, this website is
                  just an experiment to test building most of it manually).
                </small>
                <small className="text-sm">
                  *** Forked and merged all the contributions that were pending
                  &amp; made some adjustments.
                </small>
              </div>
            </article>
          </section>

          {/* TODO add index page */}
          <Link href="/app" passHref>
            <Button as="a" className="max-w-xs" size="lg">
              Go to the app!
            </Button>
          </Link>
        </Card>
        {/* <p className="mt-3 text-lg">
          An app that allows you to create images with html
          <Button
            as="a"
            external
            href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial"
            theme="tertiary"
          >
            <code className="font-mono">canvas</code>.
          </Button>
        </p> */}
      </main>
    </div>
  );
};

export default Home;
