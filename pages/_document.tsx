import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-gray-800 dark:text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
