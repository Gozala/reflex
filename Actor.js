// @flow strict

import { nothing } from "./Basics.js"
import { Tagged } from "./Effect.js"

/*::
import type { Main, Port, ThreadID, Thread } from "./widget.js"
import type { Effect } from "./Effect.js"

export type {Effect}
*/

class Exit /*::<message, a>*/ {
  /*::
  thread:Actor<message>
  reason:?Error
  */
  constructor(thread /*: Actor<message>*/, reason /*:?Error*/) {
    this.thread = thread
    this.reason = reason
  }
  map /*::<b>*/(tag /*:a => b*/) /*:Effect<b>*/ {
    return new Tagged(this, tag)
  }
  perform(main /*: Main<a>*/) {
    const thread = main.linked(this.thread)
    if (thread) {
      thread.exit(this.reason)
    }
  }
}

class Spawn /*::<inn, out>*/ {
  /*::
  behavior: Behavior<inn, out>
  onSpawn: (Actor<inn>) => ?out
  onExit: (?mixed) => ?out
  */
  constructor(
    behavior /*: Behavior<inn, out>*/,
    onSpawn /*: (Actor<inn>) => ?out*/,
    onExit /*: (?mixed) => ?out*/
  ) {
    this.behavior = behavior
    this.onSpawn = onSpawn
    this.onExit = onExit
  }
  map /*::<tagged>*/(tag /*:out => tagged*/) /*:Effect<tagged>*/ {
    return new Tagged(this, tag)
  }
  perform(main /*: Main<out>*/) {
    const thread = new Self(new Channel(), main)
    const threadID = main.link(thread)
    thread.run(this.behavior)
    const message = this.onSpawn(threadID)
    if (message != null) {
      main.send(message)
    }
  }
}

class Self /*::<inn, out>*/ {
  /*::
  result: {ok:true, value:null} | {ok:false, error:mixed} | null
  inbox:Inbox<inn>
  outbox:Outbox<out>
  */
  constructor(inbox /*: Inbox<inn>*/, outbox /*: Outbox<out>*/) {
    this.inbox = inbox
    this.outbox = outbox
  }
  send(message /*:out*/) {
    this.outbox.send(message)
  }
  receive() {
    this.inbox.receive()
  }
  async run(behavior /*:Behavior<inn, out>*/) {
    try {
      await behavior(this)
      this.exit()
    } catch (error) {
      this.exit(error)
    }
  }
  exit(error /*:?mixed*/) {
    if (this.result == null) {
      const ok = error == null
      const result = ok ? { ok, value: null } : { ok, error }
      this.result = result
    }
  }
}

class Channel /*::<a>*/ {
  /*::
  queue: { deliver(a): void, crash(Error): void }[]
  buffer: a[]
  wait: ((a) => void, (Error) => void) => void
  */
  constructor() {
    this.wait = (deliver, crash) => {
      this.queue.push({ deliver, crash })
    }
  }
  receive() /*:Promise<a>*/ {
    const { buffer, queue } = this
    if (buffer.length > 0) {
      return Promise.resolve(buffer.shift())
    } else {
      return new Promise(this.wait)
    }
  }
  send(message /*:a*/) {
    const { buffer, queue } = this
    if (queue.length > 0) {
      queue.shift().deliver(message)
    } else {
      this.buffer.push(message)
    }
  }
}
/*::
export type Act = Promise<void> & {
  // exit(?Error): void
}

export interface Inbox<message> {
  receive(): Promise<message>;
}

export interface Outbox<message> {
  send(message): mixed;
}

export opaque type Actor<message> = ThreadID

type Behavior<inn, out> = (Self<inn, out>) => Promise<void>
*/

export const spawn = /*::<inn, out>*/ (
  behavior /*: Behavior<inn, out>*/,
  onSpawn /*: (Actor<inn>) => ?out*/,
  onExit /*: (?mixed) => ?out*/
) /*: Effect<out>*/ => new Spawn(behavior, onSpawn, onExit)

export const exit = /*::<inn, out>*/ (
  thread /*: Actor<inn>*/,
  reason /*: ?Error*/
) /*: Effect<out>*/ => new Exit(thread, reason)
