import { bind, shareLatest } from "@react-rxjs/core"
import { combineKeys } from "@react-rxjs/utils"
import { distinctUntilChanged, filter, map, pipe, scan, startWith } from "rxjs"
import { ad$, adsAmount$ } from "./ads"

// TEMPORARY CODE STARTS
//
// TODO: starting here until the end of the tags$ definition
// is temporary code that will be removed once the `tags` query
// works as expected. In the meanwhile this code accomplishes the
// same thing by deriving that information locally.

const [, adTagsDeltas$] = bind(
  pipe(
    ad$,
    scan((acc, current) => [acc[1], new Set(current?.tags ?? [])] as const, [
      new Set<string>(),
      new Set<string>(),
    ] as const),
    map(([prev, current]) => {
      const added: string[] = []
      const deleted: string[] = []

      current.forEach((tag) => {
        if (!prev.has(tag)) {
          added.push(tag)
        }
      })

      if (prev.size + added.length === current.size) {
        return { added, deleted }
      }

      prev.forEach((tag) => {
        if (!current.has(tag)) {
          deleted.push(tag)
        }
      })

      return { added, deleted }
    }),
    filter(({ added, deleted }) => added.length > 0 || deleted.length > 0),
  ),
)

const adIds$ = adsAmount$.pipe(
  map((nAds) =>
    Array(nAds)
      .fill(null)
      .map((_, idx) => idx),
  ),
)

const tags$ = combineKeys(adIds$, adTagsDeltas$).pipe(
  scan((acc, deltas) => {
    const result = new Map(acc)

    deltas.changes.forEach((adId) => {
      const { added, deleted } = deltas.get(adId)!
      deleted.forEach((deletedTag) => {
        if (result.get(deletedTag) === acc.get(deletedTag)) {
          result.set(deletedTag, new Set(acc.get(deletedTag)!))
        }

        result.get(deletedTag)!.delete(adId)

        if (result.get(deletedTag)!.size === 0) {
          result.delete(deletedTag)
        }
      })

      added.forEach((addedTag) => {
        if (!result.has(addedTag)) {
          result.set(addedTag, new Set<number>())
        } else if (result.get(addedTag) === acc.get(addedTag)) {
          result.set(addedTag, new Set(acc.get(addedTag)!))
        }

        result.get(addedTag)!.add(adId)
      })
    })

    return result
  }, new Map<string, Set<number>>()),
  startWith(new Map()),
  shareLatest(),
)

// TEMPORARY CODE ENDS
// once the tags endpoint is working we should be able to replace
// all ^^ that code with the following line:
// const tags$ = adzQuery('tags').pipe(shareLatest())

const sortedTags$ = tags$.pipe(
  map((adIdsByTag) =>
    [...adIdsByTag]
      .map(([tag, ads]) => ({
        tag,
        nAds: ads.size,
      }))
      .sort((a, b) => b.nAds - a.nAds)
      .map(({ tag }) => tag),
  ),
)

export const [useAdIdsByTag, getAdIdsByTag$] = bind((tag: string) =>
  tags$.pipe(
    map((adIdsByTag) => adIdsByTag.get(tag)!),
    distinctUntilChanged(),
    map((ids) => [...ids].reverse()),
  ),
)
combineKeys(sortedTags$, getAdIdsByTag$).subscribe()

export const [useTopTags, topTags$] = bind(
  sortedTags$.pipe(map((topTags) => topTags.filter((_, idx) => idx < 10))),
)
topTags$.subscribe()
