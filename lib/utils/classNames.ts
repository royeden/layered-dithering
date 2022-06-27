// Port https://github.com/lukeed/clsx from this fork: https://github.com/XaveScor/clsx/tree/smaller-size
// Uses `let` instead of `var` & typeof optimization from this fork: https://github.com/rokoroku/clsx/tree/patch-1

function toVal(mix: any) {
  let k,
    str = "",
    type = typeof mix;

  if (type === "string" || type === "number") {
    return mix;
  }

  if (type === "object") {
    if (Array.isArray(mix)) {
      for (let y = 0; y < mix.length; y++) {
        if (mix[y]) {
          if ((k = toVal(mix[y]))) {
            str && (str += " ");
            str += k;
          }
        }
      }
    } else {
      for (k in mix) {
        if (mix[k]) {
          str && (str += " ");
          str += k;
        }
      }
    }
  }

  return str;
}

export default function classNames(...args: any[]) {
  let i = 0,
    tmp,
    x,
    str = "";
  while (i < args.length) {
    if ((tmp = args[i++])) {
      if ((x = toVal(tmp))) {
        str && (str += " ");
        str += x;
      }
    }
  }
  return str;
}
