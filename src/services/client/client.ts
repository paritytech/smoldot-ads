import { firstValueFrom, Observable } from "rxjs"
import { startWith, switchMap, mapTo, withLatestFrom } from "rxjs/operators"
import { createSignal } from "@react-rxjs/utils"
import { bind, shareLatest } from "@react-rxjs/core"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { definitions } from "../../config/definitions"
import {
  AdzApi,
  AdzMutations,
  AdzQueries,
  PolkaMutation,
  PolkaQueryFunction,
} from "./Adz"
import { ExcludeLast, observableFromPolka, OnlyLast } from "../utils"
import { activeAccount$ } from "../accounts"

const { types } = definitions
const DEFAULT_PROVIDER = "ws://127.0.0.1:9944"

const [providerChange$, changeProvider] = createSignal<string>()
export { changeProvider }

const api$ = providerChange$.pipe(
  startWith(DEFAULT_PROVIDER),
  switchMap(
    (config) =>
      ApiPromise.create({
        provider: new WsProvider(config),
        types,
      }) as Promise<AdzApi>,
  ),
  shareLatest(),
)

export const [useIsApiReady] = bind(api$.pipe(mapTo(true)), false)

type MutationArgs<T extends PolkaMutation<any[], any>> =
  T extends PolkaMutation<infer A, any> ? A : unknown
type MutationReturn<T extends PolkaMutation<any[], any>> =
  T extends PolkaMutation<any, infer R> ? R : unknown

export const adzMutation = <K extends keyof AdzMutations>(
  key: K,
  ...args: MutationArgs<AdzMutations[K]>
): Promise<MutationReturn<AdzMutations[K]>> =>
  firstValueFrom(
    api$.pipe(
      withLatestFrom(activeAccount$),
      switchMap(([api, author]) =>
        (
          api.tx.adz[key] as unknown as PolkaMutation<
            MutationArgs<AdzMutations[K]>,
            MutationReturn<AdzMutations[K]>
          >
        )(...args).signAndSend(author),
      ),
    ),
  )

type QueryArgs<T extends PolkaQueryFunction<any[], any[]>> = T extends (
  ...args: infer A
) => any
  ? ExcludeLast<A>
  : unknown

type UnTupleIfOne<T extends any[]> = T extends [infer R] ? R : T

type QueryReturn<T extends PolkaQueryFunction<any[], any[]>> = (
  T extends (...args: infer A) => any ? OnlyLast<A> : unknown
) extends [(...cb: infer R) => unknown]
  ? UnTupleIfOne<R>
  : any

export const adzQuery = <K extends keyof AdzQueries>(
  query: K,
  ...args: QueryArgs<AdzQueries[K]>
): Observable<QueryReturn<AdzQueries[K]>> =>
  api$.pipe(
    switchMap((api) =>
      observableFromPolka<QueryReturn<AdzQueries[K]>>((next) =>
        api.query.adz[query](...(args as any[]), ((...res: any) => {
          next(res.length === 1 ? res[0] : res)
        }) as any),
      ),
    ),
  )
