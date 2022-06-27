import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { HTMLAttributes, useEffect, useState } from "react";
import useLocalStorage from "../../lib/hooks/useLocalStorage";
import classNames from "../../lib/utils/classNames";
import ActiveLink from "../UI/ActiveLink";
import Button from "../UI/Button";

const ROUTES = [
  { href: "/", label: "Home" },
  { href: "/app", label: "App" },
  // { href: "/about", label: "About" },
];

interface NavigationProps extends HTMLAttributes<HTMLElement> {}

export default function Navigation({ className, ...props }: NavigationProps) {
  const [theme, setTheme] = useLocalStorage<"dark" | "light">("theme", "dark");
  const [inDOM, setInDOM] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  useEffect(() => {
    setInDOM(true);
  }, []);

  return (
    <nav
      {...props}
      className={classNames(
        "flex items-center justify-between bg-white p-2 shadow transition-colors duration-300 dark:bg-gray-800",
        className
      )}
    >
      <ul className="container flex items-center space-x-4 p-1 capitalize text-gray-600 dark:text-gray-300 sm:p-3">
        {ROUTES.map(({ href, label }) => (
          <li key={href} className="relative min-w-max">
            <ActiveLink
              activeClassName="after:border-purple-500 after:absolute after:inset-1 after:border-b-2"
              href={href}
            >
              <Button theme="transparent">{label}</Button>
            </ActiveLink>
          </li>
        ))}
      </ul>
      <div className="flex space-x-4">
        <Button
          as="a"
          className="flex h-12 w-12 items-center justify-center p-3"
          href="https://github.com/royeden/layered-dithering"
          size="none"
          theme="transparent"
        >
          <GitHubLogoIcon className="h-full w-full" />
        </Button>
        <Button
          className="flex h-12 w-12 items-center justify-center p-3"
          aria-label={`Toggle ${
            inDOM && theme === "dark" ? "light" : "dark"
          } mode`}
          onClick={() => {
            setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
          }}
          size="none"
          theme="transparent"
        >
          {inDOM && theme === "dark" ? (
            <MoonIcon className="h-full w-full" />
          ) : (
            <SunIcon className="h-full w-full" />
          )}
        </Button>
      </div>
    </nav>
  );
}
