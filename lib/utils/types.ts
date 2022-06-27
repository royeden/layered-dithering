export function deepCopy<T>(source: T): T {
  return Array.isArray(source)
    ? source.map((item) => deepCopy(item))
    : source instanceof Date
    ? new Date(source.getTime())
    : source && typeof source === "object"
    ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
        Object.defineProperty(
          o,
          prop,
          Object.getOwnPropertyDescriptor(source, prop)!
        );
        o[prop] = deepCopy((source as { [key: string]: any })[prop]);
        return o;
      }, Object.create(Object.getPrototypeOf(source)))
    : (source as T);
}

export function compare<T>(
  value: unknown,
  values: T | T[],
  transform?: (item: T, ...args: unknown[]) => unknown
): boolean {
  return Array.isArray(values)
    ? (transform
        ? values.map((item, ...args) => transform(item, ...args))
        : values
      ).includes(value)
    : (transform?.(values) ?? values) !== value;
}

// https://stackoverflow.com/questions/53503813/get-dictionary-object-keys-as-tuple-in-typescript
export type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never;

export type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
export type _TupleOf<
  T,
  N extends number,
  R extends unknown[]
> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;

export type KeysOf<T> = UnionToTuple<keyof T>;

export type TupleToUnion<T extends any[], TupleToUnion = never> =
  | T[number]
  | TupleToUnion;
