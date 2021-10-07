import { bind, shareLatest } from "@react-rxjs/core"
import { combineKeys, createSignal, MapWithChanges } from "@react-rxjs/utils"
import {
  pluck,
  pipe,
  scan,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  filter,
  of,
} from "rxjs"
import { combineLatest, switchMap } from "rxjs"
import { activeAccount$ } from "./accounts"
import { ad$, adIds$ } from "./ads"
import { comment$ } from "./comments"
import { tags$ } from "./tags"

const activeAds$ = combineKeys(adIds$, pipe(ad$, map(Boolean))).pipe(
  map((active) =>
    [...active.entries()]
      .filter(([, isActive]) => isActive)
      .map(([idx]) => idx),
  ),
  shareLatest(),
)

const byAdAuthor$ = combineKeys(
  activeAds$,
  pipe(ad$, filter(Boolean), pluck("author")),
).pipe(
  scan((acc, current) => ({ prev: acc.current, current }), {
    prev: new Map<number, string>() as MapWithChanges<number, string>,
    current: new Map<number, string>() as MapWithChanges<number, string>,
  }),
  scan((acc, { prev, current }) => {
    const result = new Map(acc)

    current.changes.forEach((adIdx) => {
      const author = current.has(adIdx) ? current.get(adIdx)! : prev.get(adIdx)!
      const adIdxs = new Set<number>(result.get(author) ?? [])

      if (current.has(adIdx)) {
        adIdxs.add(adIdx)
      } else {
        adIdxs.delete(adIdx)
      }

      if (adIdxs.size > 0) {
        result.set(author, adIdxs)
      } else {
        result.delete(author)
      }
    })
    return result
  }, new Map<string, Set<number>>()),
)
byAdAuthor$.subscribe()

const byAdCommentsAuthor$ = combineKeys(activeAds$, (adIdx: number) => {
  const commentIdx$ = ad$(adIdx).pipe(
    filter(Boolean),
    pluck("numOfComments"),
    distinctUntilChanged(),
    map((nComments) =>
      Array(nComments)
        .fill(null)
        .map((_, idx) => idx),
    ),
  )

  const activeAuthors$ = combineKeys(commentIdx$, (commentIdx: number) =>
    comment$(adIdx, commentIdx).pipe(map((comment) => comment?.author)),
  ).pipe(
    map(
      (active) =>
        new Set(
          [...active.values()].filter((author): author is string => !!author),
        ),
    ),
  )

  return combineKeys(activeAuthors$, (author: string) => of(author))
}).pipe(
  scan((acc, current) => ({ prev: acc.current, current }), {
    prev: new Map<number, Map<string, string>>() as MapWithChanges<
      number,
      MapWithChanges<string, string>
    >,
    current: new Map<number, Map<string, string>>() as MapWithChanges<
      number,
      MapWithChanges<string, string>
    >,
  }),
  scan((acc, ads) => {
    const toAdd: Array<[string, number]> = []
    const toDelete: Array<[string, number]> = []

    ads.current.changes.forEach((adIdx) => {
      if (!ads.current.has(adIdx)) {
        ads.prev.get(adIdx)!.forEach((author) => {
          toDelete.push([author, adIdx])
        })
      } else {
        ads.current.get(adIdx)!.changes.forEach((author) => {
          const delta: [string, number] = [author, adIdx]
          const target = ads.current.get(adIdx)!.has(author) ? toAdd : toDelete
          target.push(delta)
        })
      }
    })

    if (!toAdd.length && !toDelete.length) return acc

    const result = new Map(acc)

    toAdd.forEach(([author, adIdx]) => {
      if (result.get(author) === acc.get(author)) {
        result.set(author, new Set(acc.get(author) ?? []))
      }
      result.get(author)!.add(adIdx)
    })

    toDelete.forEach(([author, adIdx]) => {
      if (result.get(author) === acc.get(author)) {
        result.set(author, new Set(acc.get(author) ?? []))
      }
      result.get(author)!.delete(adIdx)
    })

    return result
  }, new Map<string, Set<number>>()),
)
byAdCommentsAuthor$.subscribe()

const [selectedTags$, onChangeSelectedTags] = createSignal<string[]>()
export { onChangeSelectedTags }

export enum AdFilters {
  All,
  MyAds,
  MyComments,
}

const [selectedFilter$, onChangeSelectedFilter] = createSignal<AdFilters>()
export { onChangeSelectedFilter }

export const [useActiveFilter, activeFilter$] = bind(
  selectedFilter$,
  AdFilters.All,
)

const userAds$ = activeAccount$.pipe(
  switchMap((account) =>
    byAdAuthor$.pipe(
      map((dic) => dic.get(account.address) ?? new Set<number>()),
    ),
  ),
)
export const [useMyAdsCount] = bind(userAds$.pipe(pluck("size")), 0)

const userCommentAds$ = activeAccount$.pipe(
  switchMap((account) =>
    byAdCommentsAuthor$.pipe(
      map((dic) => dic.get(account.address) ?? new Set<number>()),
    ),
  ),
)
export const [useMyCommentedAdsCount] = bind(
  userCommentAds$.pipe(pluck("size")),
  0,
)

const idsByAdFilter: Record<AdFilters, Observable<Set<number>>> = {
  [AdFilters.All]: adIds$.pipe(map((ids) => new Set(ids))),
  [AdFilters.MyAds]: userAds$,
  [AdFilters.MyComments]: userCommentAds$,
}
const userAdIdx$ = activeFilter$.pipe(switchMap((kind) => idsByAdFilter[kind]))

const tagsAdsIdx$ = selectedTags$.pipe(
  startWith([]),
  switchMap((selectedTags) =>
    selectedTags.length > 0
      ? tags$.pipe(
          map((tags) => {
            let result = new Set<number>()
            tags.forEach((idxs) => {
              result = new Set([...result, ...idxs])
            })

            return result
          }),
        )
      : [null],
  ),
)

export const [useFilteredAds] = bind(
  combineLatest([userAdIdx$, tagsAdsIdx$]).pipe(
    map(([userIdxs, tagIdxs]) => {
      const result = [...userIdxs].sort((a, b) => b - a)
      return tagIdxs === null
        ? result
        : result.filter((idx) => tagIdxs.has(idx))
    }),
  ),
  [],
)
