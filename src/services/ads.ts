import type { IKeyringPair } from "@polkadot/types/types"
import { bind } from "@react-rxjs/core"
import { firstValueFrom } from "rxjs"
import { observeApi, withAPI, RawData } from "./client"
import { epochToDate, persistLocally } from "./utils"

interface RawAdd {
  author: string
  body: string
  created: string
  num_of_comments: string
  selected_applicant: null
  tags: Array<string>
  title: string
}

export interface Ad {
  id: number
  author: string
  title: string
  body: string
  tags: string[]
  created: Date
  numOfComments: number
}

export const [useAddsAmount] = bind(
  observeApi<number>((api, cb) =>
    (api.query.adz.numOfAds as any)((rawData: { toString: () => string }) =>
      cb(Number(rawData.toString())),
    ),
  ).pipe(persistLocally("addsAmount")),
  0,
)

export const [useAd, add$] = bind((adId: number) =>
  observeApi<Ad | null>((api, next) =>
    (api.query.adz.ads as any)(adId, (rawAdd: RawData<RawAdd> | undefined) => {
      if (rawAdd === undefined) {
        next(null)
        return
      }

      const parsedAdd = rawAdd.toHuman()
      const numOfComments = Number(parsedAdd.num_of_comments)
      const created = epochToDate(parsedAdd.created)
      const ad: Ad = { ...parsedAdd, id: adId, numOfComments, created }

      next(ad)
    }),
  ).pipe(persistLocally(`add-${adId}`)),
)

export const createAd = (
  title: string,
  content: string,
  tags: string[],
  author: IKeyringPair,
) =>
  firstValueFrom(
    withAPI(
      (api) =>
        (api.tx.adz as any)
          .createAd(title, content, tags)
          .signAndSend(author) as Promise<RawData>,
    ),
  )

export const deleteAd = (id: number, author: IKeyringPair) =>
  firstValueFrom(
    withAPI(
      (api) =>
        (api.tx.adz as any)
          .deleteAd(id)
          .signAndSend(author) as Promise<RawData>,
    ),
  )
