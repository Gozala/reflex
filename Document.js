// @flow strict

import { virtualize, diff, patch, doc } from "./VirtualDOM.js"
import { Widget } from "./Widget.js"

/*::
import type { Program, MainThread, Transaction } from "./widget.js"
import type { Node, Doc } from "./VirtualDOM.js"

export type { Node, Doc, Program, Widget, Transaction }

export type Root = {
  body:Element,
  title:string,
  location:Location,
  widget:?{
    node:Doc<any>;
    thread:MainThread<any>
  }
}
*/

export class DocumentWidget /*::<a, model, config>*/ extends Widget /*::<a, model, Doc<a>, Root, config>*/ {
  static root(document /*:Document*/) /*:Root*/ {
    const root /*:any*/ = document
    if (!document.body) {
      document.appendChild(document.createElement("body"))
    }
    return root
  }
  mount(root /*:Root*/) /*:Doc<a>*/ {
    return root.widget
      ? root.widget.node
      : doc(root.title, virtualize(root.body))
  }
  fork(root /*:Root*/) /*:MainThread<a>*/ {
    const thread = root.widget ? root.widget.thread : Widget.fork(this)
    thread.root = this
    return thread
  }
  render(state /*:model*/) {
    const newDocument = this.view(state)
    const renderedDocument = this.node
    const delta = diff(renderedDocument.body, newDocument.body)
    patch(this.root.body, renderedDocument.body, delta, this.thread)
    this.node = newDocument
    if (renderedDocument.title !== newDocument.title) {
      this.root.title = newDocument.title
    }
  }
}

export const spawn = /*::<a, model, config>*/ (
  { init, update, view } /*:Program<a, model, Doc<a>, config>*/,
  options /*:config*/,
  document /*:Document*/
) /*:Widget<a, model, Doc<a>, Root, config>*/ => {
  const self = new DocumentWidget()
  const root = DocumentWidget.root(document)
  self.update = update
  self.view = view
  self.root = root
  self.node = self.mount(root)
  self.thread = self.fork(root)
  root.widget = self
  self.transact(init(options))
  return self
}
