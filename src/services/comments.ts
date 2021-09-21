import type { IKeyringPair } from "@polkadot/types/types"
import { bind } from "@react-rxjs/core"
import { firstValueFrom } from "rxjs"
import { observeApi, withAPI, RawData } from "./client"
import { epochToDate, persistLocally } from "./utils"

interface RawComment {
  author: string
  body: string
  created: string
}

export interface Comment {
  adId: number
  commentIdx: number
  author: string
  body: string
  created: Date
}

export const createComment = (
  adId: number,
  body: string,
  author: IKeyringPair,
) =>
  firstValueFrom(
    withAPI(
      (api) =>
        (api.tx.adz as any)
          .createComment(body, adId)
          .signAndSend(author) as Promise<RawData>,
    ),
  )

export const deleteComment = (
  adId: number,
  commentId: number,
  author: IKeyringPair,
) =>
  firstValueFrom(
    withAPI(
      (api) =>
        (api.tx.adz as any)
          .deleteComment(adId, commentId)
          .signAndSend(author) as Promise<RawData>,
    ),
  )

export const [useComment] = bind(
  (adId: number, commentIdx: number) =>
    observeApi<Comment>((api, next) =>
      (api.query.adz.comments as any)(
        adId,
        commentIdx,
        (data: RawData<RawComment>) => {
          const rawComment = data.toHuman()
          next({
            ...rawComment,
            adId,
            commentIdx,
            created: epochToDate(rawComment.created),
          })
        },
      ),
    ).pipe(persistLocally(`comment-${adId}-${commentIdx}`)),
  null,
)
