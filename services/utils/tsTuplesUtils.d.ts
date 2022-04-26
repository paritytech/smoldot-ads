export declare type OnlyFirst<T extends any[]> = T extends [any, any, ...any] ? T extends [...infer Rest, any] ? OnlyFirst<Rest> : never : T;
export declare type ExcludeFirst<T extends any[]> = T extends [unknown, ...infer V] ? V : any;
export declare type MoveFirstToTheEnd<T extends any[]> = [
    ...ExcludeFirst<T>,
    ...OnlyFirst<T>
];
export declare type OnlyLast<T extends any[]> = T extends [any, any, ...any] ? T extends [any, ...infer Rest] ? OnlyLast<Rest> : never : T;
export declare type ExcludeLast<T extends any[]> = T extends [...infer V, unknown] ? V : any;
//# sourceMappingURL=tsTuplesUtils.d.ts.map