import { ApiPromise } from "@polkadot/api"
import { Signer } from "@polkadot/api/types"
import { KeyringPair } from "@polkadot/keyring/types"
import { MoveFirstToTheEnd } from "../utils"
import type { ISubmittableResult } from "@polkadot/types/types"

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

type SignAndSendFn<T> = {
  (
    address: string,
    options: { signer: Signer },
    cb: (update: T) => void,
  ): Promise<() => void>
  (keyring: KeyringPair, cb: (update: T) => void): Promise<() => void>
}
export interface SignAndSend<T> {
  signAndSend: SignAndSendFn<T>
}

export type PolkaMutation<A extends any[], R = ISubmittableResult> = (
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
  updateAd: PolkaMutation<
    [adIdx: number, title: string, content: string, tags: string[]]
  >
  createComment: PolkaMutation<[body: string, adIdx: number]>
  deleteComment: PolkaMutation<[adIdx: number, commentIdx: number]>
  selectApplicant: PolkaMutation<[adIdx: number, applicant: string]>
}

export interface AdzQueries {
  numOfAds: PolkaQueryFunction<[], [numOfAds: { toString: () => string }]>
  ads: PolkaQueryFunction<[adIdx: number], [rawAdd: RawData<RawAdd>]>
  comments: PolkaQueryFunction<
    [adIdx: number, commentIdx: number],
    [RawData<RawComment>]
  >
  tags: PolkaQueryFunction<[], [RawData<Map<string, Set<number>>>]>
}

export interface SystemQueries {
  account: PolkaQueryFunction<
    [address: string],
    [{ data: { free: RawData<number> } }]
  >
}

export type AdzApi = ApiPromise & {
  tx: ApiPromise["tx"] & { adz: AdzMutations }
  query: ApiPromise["query"] & {
    system: SystemQueries
    adz: AdzQueries
  }
}
