// @noflow

export class Future {
  constructor(execute, params) {
    this.execute = execute
    this.params = params
  }
  then(onResolve, onReject) {
    const promise = this.perform()
    if (promise && promise.then) {
      return promise.then(onResolve, onReject)
    } else {
      return Promise.resolve(promise).then(onResolve, onReject)
    }
  }
  perform() {
    return this.execute(...this.params)
  }
}
Object.setPrototypeOf(Future.prototype, Promise.prototype)

export const future = fn => (...params) => new Future(fn, params)
