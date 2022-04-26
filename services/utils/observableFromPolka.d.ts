import { Observable } from "rxjs";
export declare const observableFromPolka: <T>(next: (cb: (value: T) => void) => Promise<() => void>) => Observable<T>;
//# sourceMappingURL=observableFromPolka.d.ts.map