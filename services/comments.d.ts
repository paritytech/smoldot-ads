import type { ISubmittableResult } from "@polkadot/types/types";
export interface Comment {
    adIdx: number;
    commentIdx: number;
    author: string;
    body: string;
    created: Date;
}
export declare const createComment: (adIdx: number, body: string, cb?: ((result: ISubmittableResult) => void) | undefined) => import("rxjs").Subscription;
export declare const deleteComment: (adIdx: number, commentIdx: number, cb?: ((result: ISubmittableResult) => void) | undefined) => import("rxjs").Subscription;
export declare const useComment: (adIdx: number, commentIdx: number) => Comment | null, comment$: (adIdx: number, commentIdx: number) => import("@react-rxjs/core").DefaultedStateObservable<Comment | null>;
//# sourceMappingURL=comments.d.ts.map