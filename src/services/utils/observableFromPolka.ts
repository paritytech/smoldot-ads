import { Observable } from "rxjs"

export const observableFromPolka = <T>(
  next: (cb: (value: T) => void) => Promise<() => void>,
): Observable<T> =>
  new Observable<T>((observer) => {
    let isActive = true
    let unsubscribe = Function.prototype

    next((x: T) => {
      isActive && observer.next(x)
    })
      .then((cb) => {
        if (isActive) unsubscribe = cb
        else cb()
      })
      .catch((e) => observer.error(e))

    return () => {
      isActive = false
      unsubscribe()
    }
  })
