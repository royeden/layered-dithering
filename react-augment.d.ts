// See this article on why this update is done :D https://fettblog.eu/typescript-react-generic-forward-refs/
import React from "react";

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}
