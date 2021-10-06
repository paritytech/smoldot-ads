import { firstValueFrom, Observable } from "rxjs"
import { startWith, switchMap, mapTo, withLatestFrom } from "rxjs/operators"
import { createSignal } from "@react-rxjs/utils"
import { bind, shareLatest } from "@react-rxjs/core"
import { definitions } from "../../config/definitions"
import {
  AdzApi,
  AdzMutations,
  AdzQueries,
  PolkaMutation,
  PolkaQueryFunction,
  SystemQueries,
} from "./Adz"
import { ExcludeLast, observableFromPolka, OnlyLast } from "../utils"
import { activeAccount$ } from "../accounts"

import { Detector } from "@substrate/connect"
import adz from "../../assets/adz.json"

const { types } = definitions
const DEFAULT_PROVIDER = "ws://127.0.0.1:9944"

const [providerChange$, changeProvider] = createSignal<string>()
export { changeProvider }

const api$ = providerChange$.pipe(
  startWith(DEFAULT_PROVIDER),
  switchMap(() => {
    const detect = new Detector("Classified Ads")
    return detect.connect("westend", JSON.stringify(adz), {
      types,
    }) as unknown as Promise<AdzApi>
  }),
  // switchMap(
  //   (config) =>
  //     ApiPromise.create({
  //       provider: new WsProvider(config),
  //       types,
  //     }) as unknown as Promise<AdzApi>,
  // ),
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
        )(...args).signAndSend({ signer: author.signer }),
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

export const systemQuery = <K extends keyof SystemQueries>(
  query: K,
  ...args: QueryArgs<SystemQueries[K]>
): Observable<QueryReturn<SystemQueries[K]>> =>
  api$.pipe(
    switchMap((api) =>
      observableFromPolka<QueryReturn<SystemQueries[K]>>((next) =>
        (api.query.system[query] as any)(...(args as any[]), ((...res: any) => {
          next(res.length === 1 ? res[0] : res)
        }) as any),
      ),
    ),
  )
