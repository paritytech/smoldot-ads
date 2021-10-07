import { bind, shareLatest } from "@react-rxjs/core"
import { map } from "rxjs"
import { adzMutation, adzQuery } from "./client"
import { epochToDate, persistLocally } from "./utils"

export interface Ad {
  idx: number
  author: string
  title: string
  body: string
  tags: string[]
  created: Date
  numOfComments: number
}

export const [useAdsAmount, adsAmount$] = bind(
  adzQuery("numOfAds").pipe(
    map((rawData) => Number(rawData.toString())),
    persistLocally("adsAmount"),
  ),
  0,
)

export const adIds$ = adsAmount$.pipe(
  map((nAds) =>
    Array(nAds)
      .fill(null)
      .map((_, idx) => idx),
  ),
  shareLatest(),
)

export const [useAd, ad$] = bind((adIdx: number) =>
  adzQuery("ads", adIdx).pipe(
    map((rawAd): Ad | null => {
      const parsedAd = rawAd.toHuman()
      if (!parsedAd) return null

      const numOfComments = Number(parsedAd.num_of_comments)
      const created = epochToDate(parsedAd.created)
      return { ...parsedAd, idx: adIdx, numOfComments, created }
    }),
    persistLocally(`ad-${adIdx}`),
  ),
)

export const createAd = (title: string, content: string, tags: string[]) =>
  adzMutation("createAd", title, content, tags)

export const deleteAd = (adIdx: number) => adzMutation("deleteAd", adIdx)

export const updateAd = (
  adIdx: number,
  title: string,
  content: string,
  tags: string[],
) => adzMutation("updateAd", adIdx, title, content, tags)

export const selectApplicant = (adIdx: number, applicant: string) =>
  adzMutation("selectApplicant", adIdx, applicant)
