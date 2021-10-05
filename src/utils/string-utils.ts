export const isEmptyText = (input: string): boolean =>
  input.trimStart().trimEnd().length === 0

export const makeEllipsis = (some: string) =>
  some
    .slice(0, 4)
    .concat("...")
    .concat(some.slice(some.length - 4))

export const capitalize = (some: string) =>
  some.charAt(0).toUpperCase() + some.slice(1)
