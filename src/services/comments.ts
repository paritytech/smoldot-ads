import type { ISubmittableResult } from "@polkadot/types/types"
import { bind } from "@react-rxjs/core"
import { map, noop } from "rxjs"
import { adzMutation, adzQuery } from "./client"
import { epochToDate, persistLocally } from "./utils"

export interface Comment {
  adIdx: number
  commentIdx: number
  author: string
  body: string
  created: Date
}

export const createComment = (
  adIdx: number,
  body: string,
  cb?: (result: ISubmittableResult) => void,
) => adzMutation("createComment", body, adIdx).subscribe(cb ?? noop)

export const deleteComment = (
  adIdx: number,
  commentIdx: number,
  cb?: (result: ISubmittableResult) => void,
) => adzMutation("deleteComment", adIdx, commentIdx).subscribe(cb ?? noop)

export const [useComment, comment$] = bind(
  (adIdx: number, commentIdx: number) =>
    adzQuery("comments", adIdx, commentIdx).pipe(
      map((rawComment): Comment | null => {
        const parsedComment = rawComment.toHuman()
        if (!parsedComment) return null
        return {
          ...parsedComment,
          adIdx,
          commentIdx,
          created: epochToDate(parsedComment.created),
        }
      }),
      persistLocally(`comment-${adIdx}-${commentIdx}`),
    ),
  null,
)
