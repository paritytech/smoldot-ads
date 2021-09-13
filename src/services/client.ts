import { Observable, concat, ObservableInput } from "rxjs"
import { startWith, switchMap, map, filter } from "rxjs/operators"
import { createSignal } from "@react-rxjs/utils"
import { bind, shareLatest } from "@react-rxjs/core"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { definitions } from "../config/definitions"
import { observableFromPolka } from "./utils"

const { types } = definitions
const DEFAULT_PROVIDER = "ws://127.0.0.1:9944"

const [providerChange$, changeProvider] = createSignal<string>()
export { changeProvider }

const currentProvider$ = providerChange$.pipe(
  startWith(DEFAULT_PROVIDER),
  map((config) => new WsProvider(config)),
  shareLatest(),
)

export const api$ = currentProvider$.pipe(
  switchMap((provider) =>
    concat([null], ApiPromise.create({ provider, types })),
  ),
  shareLatest(),
)

export const [useIsApiReady] = bind(api$.pipe(map((api) => api !== null)))

export const withAPI = <T>(
  callback: (api: ApiPromise) => ObservableInput<T>,
): Observable<T> =>
  api$.pipe(
    filter((api): api is ApiPromise => !!api),
    switchMap(callback),
  )

export const observeApi = <T>(
  callback: (api: ApiPromise, next: (value: T) => void) => Promise<() => void>,
): Observable<T> =>
  withAPI((api) => observableFromPolka((cb) => callback(api, cb)))
