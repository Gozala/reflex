// @flow strict

export const identity = /*::<a>*/ (value /*:a*/) /*:a*/ => value

export const always = /*::<a>*/ (value /*:a*/) /*:() => a*/ => () /*:a*/ => value

export const True = always(true)
export const False = always(false)
export const Null = always(null)
export const Void = always()
export const EmptyString = always("")
export const EmptyObject = always(Object.freeze({}))
const anyArray/*:any[]*/ = Object.freeze([])
export const EmptyArray/*:<$,a>($) => a[]*/ = always(anyArray)

const table/*: Object*/ = Object.freeze(Object.create(null))
export const EmptyTable/*:<$, key, value>($) => {[key]:value}*/ =
  always(table)

export const never = /*::<a>*/ (value /*:empty*/) /*:a*/ => {
  console.error(`value passed to never`, value)
  throw TypeError(
    `never was supposed to be unreachable but it was called with ${value}`
  )
}

export const nothing = /*::<a>*/ (_ /*:a*/) /*:void*/ => void _

const defaultReason =
  "Typesystem established invariant was broken at runtime, likely due to incorrect call from untyped JS."

export const panic =/*::<error>*/(reason/*: string | error*/ = defaultReason)/*: empty*/ => {
  throw typeof reason === "string" ? Error(reason) : reason
}
