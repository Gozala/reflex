// @flow strict

import { DocumentWidget } from "./Document.js"

/*::
import type { Doc, Node, Program, Widget, Transaction } from "./Document.js"

export type { Node, Program, Transaction, Widget, Doc }

export type Application<message, state, options> = {
  +onExternalURLRequest: (URL) => message;
  +onInternalURLRequest: (URL) => message;
  +onURLChange: (URL) => message;

  +init: (options, URL) => Transaction<message, state>;
  +update: (message, state) => Transaction<message, state>;
  +view: (state) => Doc<message>;
}
*/

class ApplicationWidget /*::<a, model, config>*/ extends DocumentWidget /*::<a, model, config>*/ {
  /*::
  onExternalURLRequest: (URL) => a;
  onInternalURLRequest: (URL) => a;
  onURLChange: (URL) => a;
  */
  getURL() {
    return new URL(this.root.location.href)
  }
  handleEvent(event) {
    switch (event.type) {
      case "navigate": // manually notify when we do pushState replaceState
      case "popstate":
      case "hashchange":
        return this.thread.send(this.onURLChange(this.getURL()))
      case "click": {
        if (
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey &&
          event.button < 1 &&
          !event.target.target &&
          !event.target.download
        ) {
          event.preventDefault()
          const current = this.getURL()
          const next = new URL(event.currentTarget.href, current.href)

          const isInternal =
            current.protocol === next.protocol &&
            current.host === next.host &&
            current.port === next.port

          const message = isInternal
            ? this.onInternalURLRequest(next)
            : this.onExternalURLRequest(next)

          return this.thread.send(message)
        }
      }
    }
  }
  addListeners(document /*:Document*/) {
    const top = document.defaultView
    top.addEventListener("popstate", this)
    top.addEventListener("hashchange", this)
    top.onnavigate = this
  }
}

export const spawn = /*::<a, model, config>*/ (
  application /*:Application<a, model, config>*/,
  options /*:config*/,
  document /*:Document*/
) /*:ApplicationWidget<a, model, config>*/ => {
  const self = new ApplicationWidget()
  const root = DocumentWidget.root(document)
  self.update = application.update
  self.view = application.view
  self.onExternalURLRequest = application.onExternalURLRequest
  self.onInternalURLRequest = application.onInternalURLRequest
  self.onURLChange = application.onURLChange
  self.root = root
  self.node = root.widget ? root.widget.node : self.mount(root)
  self.thread = self.fork(root)
  root.widget = self
  self.addListeners(document)

  self.transact(application.init(options, self.getURL()))

  return self
}
