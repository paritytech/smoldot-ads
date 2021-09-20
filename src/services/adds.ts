import type { IKeyringPair } from "@polkadot/types/types"
import { bind } from "@react-rxjs/core"
import { firstValueFrom } from "rxjs"
import { observeApi, withAPI } from "./client"
import { epochToDate, persistLocally } from "./utils"

export interface Add {
  id: number
  author: string
  title: string
  body: string
  tags: string[]
  created: Date
  numOfComments: number
}

export interface Comment {
  id: number
  author: string
  title: string
  body: string
  created: Date
}

export const [useAddsAmount] = bind(
  observeApi<number>((api, cb) =>
    (api.query.adz.numOfAds as any)((rawData: { toString: () => string }) =>
      cb(Number(rawData.toString())),
    ),
  ).pipe(persistLocally("addsAmount")),
  0,
)

export const [useAd, add$] = bind((addId: number) =>
  observeApi<Add | null>((api, next) =>
    (api.query.adz.ads as any)(addId, (rawAdd: string | undefined) => {
      if (rawAdd === undefined) {
        next(null)
        return
      }

      const parsedAdd = JSON.parse(rawAdd.toString())
      const numOfComments = Number(parsedAdd.num_of_comments)
      const created = epochToDate(parsedAdd.created)
      const add = { ...parsedAdd, numOfComments, created } as Add

      next(add)
    }),
  ).pipe(persistLocally(`add-${addId}`)),
)

interface RawData {
  toHuman: () => Comment
}

export const [useComment] = bind((addId: number, commentId: number) =>
  observeApi<Comment>((api, next) =>
    (api.query.adz.comments as any)(addId, commentId, (rawComment: RawData) =>
      next(rawComment.toHuman()),
    ),
  ).pipe(persistLocally(`comment-${addId}-${commentId}`)),
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
