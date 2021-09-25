import { ApiPromise } from "@polkadot/api"
import { KeyringPair } from "@polkadot/keyring/types"
import { MoveFirstToTheEnd } from "../utils"

type MoveFirstArgumentToTheEnd<T extends (...args: any) => any> = T extends (
  ...args: infer A
) => infer R
  ? (...args: MoveFirstToTheEnd<A>) => R
  : unknown

export type PolkaQueryFunction<
  A extends any[],
  T extends any[],
> = MoveFirstArgumentToTheEnd<
  (cb: (...args: T) => void, ...args: A) => Promise<() => void>
>

export interface SignAndSend<T> {
  signAndSend: (author: KeyringPair) => Promise<T>
}

export type PolkaMutation<A extends any[], R = RawData> = (
  ...args: A
) => SignAndSend<R>

export interface RawData<T = unknown> {
  toHuman: () => T | null
}

export interface RawAdd {
  author: string
  body: string
  created: string
  num_of_comments: string
  selected_applicant: null
  tags: Array<string>
  title: string
}

export interface RawComment {
  author: string
  body: string
  created: string
}

export interface AdzMutations {
  createAd: PolkaMutation<[title: string, content: string, tags: string[]]>
  deleteAd: PolkaMutation<[idx: number]>
  createComment: PolkaMutation<[body: string, adIdx: number]>
  deleteComment: PolkaMutation<[adIdx: number, commentIdx: number]>
}

export interface AdzQueries {
  numOfAds: PolkaQueryFunction<[], [numOfAds: { toString: () => string }]>
  ads: PolkaQueryFunction<[adIdx: number], [rawAdd: RawData<RawAdd>]>
  comments: PolkaQueryFunction<
    [adIdx: number, commentIdx: number],
    [RawData<RawComment>]
  >
}

export type AdzApi = ApiPromise & {
  tx: ApiPromise["tx"] & { adz: AdzMutations }
  query: ApiPromise["query"] & { adz: AdzQueries }
}
