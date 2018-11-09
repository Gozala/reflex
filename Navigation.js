// @flow strict

import { nothing } from "./Basics.js"
import { future } from "./Future.js"

/*::
import type { Task } from "./Future.js"
*/

const STATE = {}
const NAV = { type: "navigate" }

const { history, location } = window.top
const dispatch = _ => {
  if (window.top.onnavigate) {
    window.top.onnavigate.handleEvent(NAV)
  }
}

export const navigate = future((url /*:URL*/) => {
  if (location.href != url.href) {
    dispatch(history.pushState(STATE, "", url))
  }
})

export const replaceURL = future(async (url /*:URL*/) => {
  if (location.href != url.href) {
    dispatch(history.replaceState(STATE, "", url))
  }
})

export const back = future((n /*:number*/) => {
  window.top.history.go(-1 * n)
})

export const forward = future((n /*:number*/) => {
  window.top.history.go(n)
})

export const load = future((url /*:URL*/) => {
  try {
    window.top.location = url
  } catch (error) {
    window.top.location.reload(false)
  }
})

export const reload = future(() => {
  window.top.location.reload(false)
})

export const reloadAndSkipCache = future(() => {
  window.top.location.reload(true)
})
