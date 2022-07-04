export interface LayerFormUpdate<T> {
  onChange: (newValue: T) => void;
  value: T;
}
