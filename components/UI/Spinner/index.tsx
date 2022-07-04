import styles from "./spinner.module.css";
import classNames from "../../../lib/utils/classNames";

export interface SpinnerProps {
  className?: string;
}

const COLORS = [
  "bg-red-400",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-lime-400",
  "bg-green-400",
  "bg-cyan-400",
  "bg-sky-400",
  "bg-blue-400",
  "bg-indigo-400",
  "bg-violet-400",
  "bg-fuchsia-400",
  "bg-pink-400",
];

export default function Spinner({ className }: SpinnerProps) {
  return (
    <div className={classNames("grid overflow-hidden rounded-full", className)}>
      {COLORS.map((color, i) => (
        <span
          style={{
            animation: `1s linear ${i / COLORS.length}s infinite ${
              styles.spinner
            }`,
            gridColumn: 1,
            gridRow: 1,
            opacity: 0,
          }}
          key={color}
          className="block h-full w-full"
        >
          <span className={classNames("block h-1/2 w-1/2 rotate-45", color)} />
        </span>
      ))}
    </div>
  );
}
