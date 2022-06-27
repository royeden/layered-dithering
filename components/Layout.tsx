import { HTMLAttributes, useEffect } from "react";
import Navigation from "./app/Navigation";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export default function Layout({ children, ...props }: Props) {
  return (
    <div className="flex min-h-screen flex-col justify-center">
      <Navigation />
      {children}
    </div>
  );
}
