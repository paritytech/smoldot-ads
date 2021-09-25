export type OnlyFirst<T extends any[]> = T extends [any, any, ...any]
  ? T extends [...infer Rest, any]
    ? OnlyFirst<Rest>
    : never
  : T
export type ExcludeFirst<T extends any[]> = T extends [unknown, ...infer V]
  ? V
  : any
export type MoveFirstToTheEnd<T extends any[]> = [
  ...ExcludeFirst<T>,
  ...OnlyFirst<T>
]
export type OnlyLast<T extends any[]> = T extends [any, any, ...any]
  ? T extends [any, ...infer Rest]
    ? OnlyLast<Rest>
    : never
  : T
export type ExcludeLast<T extends any[]> = T extends [...infer V, unknown]
  ? V
  : any
