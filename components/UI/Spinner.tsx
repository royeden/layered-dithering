import { m } from "framer-motion";
import classNames from "../../lib/utils/classNames";

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
        <m.span
          animate={{
            opacity: [0, 1, 0],
            rotate: [0, 360],
          }}
          style={{
            y: "50%",
            originX: "center",
            originY: "top",
            gridColumn: 1,
            gridRow: 1,
          }}
          transition={{
            delay: i / 12,
            duration: 1,
            type: "tween",
            repeat: Infinity,
            // repeatType: "mirror",
          }}
          key={color}
          className="block h-full w-full"
        >
          <span className={classNames("block h-1/2 w-1/2 rotate-45", color)} />
        </m.span>
      ))}
    </div>
  );
}
