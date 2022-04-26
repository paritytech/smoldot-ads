import type { ISubmittableResult } from "@polkadot/types/types";
export interface Ad {
    idx: number;
    author: string;
    title: string;
    body: string;
    tags: string[];
    created: Date;
    numOfComments: number;
}
export declare const useAdsAmount: () => number, adsAmount$: import("rxjs").Observable<number>;
export declare const adIds$: import("rxjs").Observable<number[]>;
export declare const useAd: (adIdx: number) => Ad | null, ad$: (adIdx: number) => import("rxjs").Observable<Ad | null>;
export declare const createAd: (title: string, content: string, tags: string[], cb?: ((result: ISubmittableResult) => void) | undefined) => import("rxjs").Subscription;
export declare const deleteAd: (adIdx: number, cb?: ((result: ISubmittableResult) => void) | undefined) => import("rxjs").Subscription;
export declare const updateAd: (adIdx: number, title: string, content: string, tags: string[], cb?: ((result: ISubmittableResult) => void) | undefined) => import("rxjs").Subscription;
export declare const selectApplicant: (adIdx: number, applicant: string, cb?: ((result: ISubmittableResult) => void) | undefined) => import("rxjs").Subscription;
//# sourceMappingURL=ads.d.ts.map