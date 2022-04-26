import { Observable } from "rxjs";
declare const onChangeSelectedTags: (payload: string[]) => void;
export { onChangeSelectedTags };
export declare enum AdFilters {
    All = 0,
    MyAds = 1,
    MyComments = 2
}
declare const onChangeSelectedFilter: (payload: AdFilters) => void;
export { onChangeSelectedFilter };
export declare const useActiveFilter: () => AdFilters, activeFilter$: Observable<AdFilters>;
export declare const useMyAdsCount: () => number;
export declare const useMyCommentedAdsCount: () => number;
export declare const useFilteredAds: () => number[];
//# sourceMappingURL=filteredAdIds.d.ts.map