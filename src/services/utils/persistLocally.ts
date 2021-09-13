import { Observable } from "rxjs"

export const persistLocally =
  (key: string) =>
  <T>(source: Observable<T>) =>
    new Observable<T>((observer) => {
      const data = globalThis.localStorage.getItem(key)
      if (data) {
        const value = JSON.parse(data) as T
        observer.next(value)
      }

      return source.subscribe({
        next(value) {
          globalThis.localStorage.setItem(key, JSON.stringify(value))
          observer.next(value)
        },
        complete() {
          observer.complete()
        },
        error(e) {
          observer.error(e)
        },
      })
    })
