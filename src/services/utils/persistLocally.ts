import { Observable } from "rxjs"

const VERSION_KEY = "@smoldot-ads/schema-version"
const CURRENT_VERSION = 2

if (typeof window !== "undefined") {
  const version = Number(window.localStorage.getItem(VERSION_KEY))
  if (version !== CURRENT_VERSION) {
    window.localStorage.clear()
    window.localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString(10))
  }
}

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
