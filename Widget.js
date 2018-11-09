// @flow strict

import { diff, patch, virtualize } from "./VirtualDOM.js"

/*::
import type { Node, Port } from "./VirtualDOM.js"

export type { Node }

export opaque type ThreadID:string = string;

export interface Thread {
  exit(?Error):void;
}


export type {Port}

export interface Main<message> extends Port<message> {
  link(Thread):ThreadID;
  unlink(Thread):void;
  linked(ThreadID):?Thread;
}

export interface IO<message> {
  perform(Main<message>):mixed;
}
export type Transaction<message, state> = [state, IO<message>]

export type Program<message, state, widget, options> = {
  +init: (options) => Transaction<message, state>,
  +update: (message, state) => Transaction<message, state>,
  +view: (state) => widget
}

export type Application<message, state, widget, options> = {
  onExternalURLRequest: (URL) => message;
  onInternalURLRequest: (URL) => message;
  onURLChange: (URL) => message;

  init: (options, URL) => Transaction<message, state>;
  update: (message, state) => Transaction<message, state>;
  view: (state) => widget;
}

export type Doc<a> = {
  title:string;
  body:Node<a>
}

export interface Sync <a> {
  sync(a):void;
}
*/

export class MainThread /*::<a>*/ {
  /*::
  root:Sync<a>
  threads:{[ThreadID]:Thread}
  threadID:number
  */
  constructor(root /*:Sync<a>*/) {
    this.root = root
  }
  async send(message /*:a*/) {
    await 0
    this.root.sync(message)
  }
  sync(message /*:a*/) {
    this.root.sync(message)
  }
  link(thread /*:Thread*/) /*:ThreadID*/ {
    if (this.threadID == null) {
      this.threadID = 0
      this.threads = {}
    }

    const id = `@${++this.threadID}`
    this.threads[id] = thread
    return id
  }
  unlink(thread /*:Thread*/) {
    const { threads } = this
    if (threads) {
      for (const id in threads) {
        if (thread === threads[id]) {
          delete threads[id]
          break
        }
      }
    }
  }
  linked(threadID /*:ThreadID*/) /*:?Thread*/ {
    const { threads } = this
    if (threads) {
      return threads[threadID]
    }
  }
}

export class Widget /*::<a, model, widget, target, config>*/ {
  /*::
  thread:MainThread<a>;
  state:model;
  update:(a, model) =>Transaction<a, model>;
  view:model => widget
  root:target
  node:widget
  */
  get version() {
    const stack = new Error().stack
    const start = stack.indexOf("+")
    const end = stack.indexOf("/", start)
    return stack.slice(start, end)
  }
  static fork(self /*:Sync<a>*/) /*:MainThread<a>*/ {
    return new MainThread(self)
  }
  sync(message /*:a*/) {
    this.transact(this.update(message, this.state))
  }
  transact([state, fx] /*:Transaction<a, model>*/) {
    this.state = state
    this.render(state)
    fx.perform(this.thread)
  }
  render(state /*:model*/) {}
  mount(root /*:target*/) /*:widget*/ {
    return this.node
  }
  toJSON() {
    return this.state
  }
}

class ElementWidget /*::<a, model, config>*/ extends Widget /*::<a, model, Node<a>, Element, config>*/ {
  mount(root /*:Element*/) /*:Node<a>*/ {
    return virtualize(root)
  }
  render(state /*:model*/) {
    const newNode = this.view(state)
    const renderedNode = this.node
    const delta = diff(renderedNode, newNode)
    patch(this.root, renderedNode, delta, this.thread)
    this.node = newNode
  }
}

export const spawn = /*::<a, model, config>*/ (
  { init, update, view } /*:Program<a, model, Node<a>, config>*/,
  options /*:config*/,
  root /*:Element*/
) /*:Widget<a, model, Node<a>, Element, config>*/ => {
  const self = new ElementWidget()
  self.thread = Widget.fork(self)
  self.update = update
  self.view = view
  self.root = root
  self.node = self.mount(root)
  self.transact(init(options))
  return self
}
