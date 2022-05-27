export declare const tags$: import("rxjs").Observable<Map<string, Set<number>>>;
declare const useSortedTags: () => string[];
export { useSortedTags };
export declare const useAdIdsByTag: (tag: string) => number[], getAdIdsByTag$: (tag: string) => import("@react-rxjs/core").StateObservable<number[]>;
export declare const useTopTags: () => string[], topTags$: import("@react-rxjs/core").StateObservable<string[]>;
//# sourceMappingURL=tags.d.ts.map