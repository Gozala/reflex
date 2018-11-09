// @flow strict

import { nothing } from "./Basics.js"

/*::
import type { IO, Thread, ThreadID, Main } from "./Widget"
import type { Task } from "./Future"


export interface Effect <a> extends IO<a> {
  map <b>(a => b):Effect<b>;
}
*/

const none /*:Effect<any>*/ = {
  perform(main) {},
  map(f) {
    return this
  }
}

class Send /*::<a> implements Effect<a>*/ {
  /*::
  message:a
  */
  constructor(message /*:a*/) {
    this.message = message
  }
  perform(main /*:Main<a>*/) {
    main.send(this.message)
  }
  map /*::<b>*/(tag /*:a => b*/) /*:Effect<b>*/ {
    return new Tagged(this, tag)
  }
}

class FX /*::<a, value>*/ {
  /*::
  task:Task<value>
  onOk: value => ?a
  onError: Error => ?a
  */
  constructor(
    task /*:Task<value>*/,
    onOk /*: value => ?a*/,
    onError /*: Error => ?a*/
  ) {
    this.task = task
    this.onOk = onOk
    this.onError = onError
  }
  async execute(main /*:Main<a>*/) {
    try {
      const value = await this.task.perform()
      const message = this.onOk(value)
      if (message != null) {
        main.send(message)
      }
    } catch (error) {
      const message = this.onError(error)
      if (message != null) {
        main.send(message)
      }
    }
  }
  perform(main /*:Main<a>*/) {
    this.execute(main)
  }
  map /*::<b>*/(tag /*:a => b*/) /*:Effect<b>*/ {
    return new Tagged(this, tag)
  }
}

class Batch /*::<a>*/ {
  /*::
  effects:Effect<a>[]
  */
  constructor(effects /*:Effect<a>[]*/) {
    this.effects = effects
  }
  perform(main /*:Main<a>*/) {
    for (const fx of this.effects) {
      fx.perform(main)
    }
  }
  map /*::<b>*/(tag /*:a => b*/) /*:Effect<b>*/ {
    return new Tagged(this, tag)
  }
}

export class Tagged /*::<a, b>*/ {
  /*::
  fx: Effect<a>
  tag: a => b
  port:Main<b>
  */
  constructor(fx /*:Effect<a>*/, tag /*:a => b*/) {
    this.fx = fx
    this.tag = tag
  }
  perform(main /*:Main<b>*/) {
    this.port = main
    this.fx.perform(this)
  }
  link(thread /*:Thread*/) {
    return this.port.link(thread)
  }
  unlink(thread /*:Thread*/) {
    return this.port.unlink(thread)
  }
  linked(id /*:ThreadID*/) {
    return this.port.linked(id)
  }
  send(message /*:a*/) {
    return this.port.send(this.tag(message))
  }
  map /*::<c>*/(tag /*:b => c*/) /*:Effect<c>*/ {
    return new Tagged(this, tag)
  }
}

export const nofx = none

export const fx = /*::<value, message>*/ (
  task /*:Task<value>*/,
  ok /*:value => ?message*/ = nothing,
  error /*:Error => ?message*/ = warn
) /*:Effect<message>*/ => new FX(task, ok, error)

export const send = /*::<a>*/ (message /*:a*/) /*:Effect<a>*/ =>
  new Send(message)

export const batch = /*::<a>*/ (...fx /*:Effect<a>[]*/) /*:Effect<a>*/ =>
  new Batch(fx)

const warn = (error /*:Error*/) /*:void*/ => {
  console.warn("Task failed but error was not handled", error)
}
