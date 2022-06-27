import { useState } from "react";

export default function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const toggle = (override?: boolean) =>
    setState((prevState) => override ?? prevState);
  return [state, toggle] as const;
}
