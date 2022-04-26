import { Observable } from "rxjs";
import { AdzMutations, AdzQueries, PolkaMutation, PolkaQueryFunction, SystemQueries } from "./Adz";
import { ExcludeLast, OnlyLast } from "../utils";
import type { ISubmittableResult } from "@polkadot/types/types";
export declare const DEFAULT_PROVIDER = "wss://adz-rpc.parity.io";
declare const changeProvider: (payload: string) => void;
export { changeProvider };
export declare const useIsApiReady: () => boolean;
declare type MutationArgs<T extends PolkaMutation<any[], any>> = T extends PolkaMutation<infer A, any> ? A : unknown;
export declare const adzMutation: <K extends keyof AdzMutations>(key: K, ...args: MutationArgs<AdzMutations[K]>) => Observable<ISubmittableResult>;
declare type QueryArgs<T extends PolkaQueryFunction<any[], any[]>> = T extends (...args: infer A) => any ? ExcludeLast<A> : unknown;
declare type UnTupleIfOne<T extends any[]> = T extends [infer R] ? R : T;
declare type QueryReturn<T extends PolkaQueryFunction<any[], any[]>> = (T extends (...args: infer A) => any ? OnlyLast<A> : unknown) extends [(...cb: infer R) => unknown] ? UnTupleIfOne<R> : any;
export declare const adzQuery: <K extends keyof AdzQueries>(query: K, ...args: QueryArgs<AdzQueries[K]>) => Observable<QueryReturn<AdzQueries[K]>>;
export declare const systemQuery: <K extends "account">(query: K, ...args: QueryArgs<SystemQueries[K]>) => Observable<QueryReturn<SystemQueries[K]>>;
//# sourceMappingURL=client.d.ts.map