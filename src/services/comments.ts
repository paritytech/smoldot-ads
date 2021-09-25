import { KeyringPair } from "@polkadot/keyring/types"
import { bind } from "@react-rxjs/core"
import { map } from "rxjs"
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
  author: KeyringPair,
) => adzMutation("createComment", author, body, adIdx)

export const deleteComment = (
  adIdx: number,
  commentIdx: number,
  author: KeyringPair,
) => adzMutation("deleteComment", author, adIdx, commentIdx)

export const [useComment] = bind(
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
