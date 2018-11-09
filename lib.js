// @flow strict

import * as DOM from "./VirtualDOM.js"
import * as Element from "./Element.js"
import * as Attribute from "./Attribute.js"

import * as Widget from "./Widget.js"
import * as Document from "./Document.js"
import * as Application from "./Application.js"

import * as Effect from "./Effect.js"
import * as Navigation from "./Navigation.js"
import { future } from "./Future.js"
import { identity, never, always, nothing } from "./Basics.js"

export {
  // DOM
  DOM,
  Element,
  Attribute,
  // Spawnining VirtualDOM
  Widget,
  Document,
  Application,
  // Effect System
  Effect,
  future,
  Navigation,
  // Utilities
  identity,
  never,
  always,
  nothing
}
