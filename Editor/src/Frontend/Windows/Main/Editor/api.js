import React from 'react'
import _ from 'lodash'
import Script from '../Editors/Script'

class API {
  constructor() {
    this.editors = {}
    this.subscriber = null
  }
  addEditor(name, editor) {
    if (name in this.editors) return // We already have this editor
    this.editors[name] = editor
    this.update(name)
  }
  removeEditor(name) {
    delete this.editors[name]
    this.update()
  }
  has(name) {
    return !!this.editors[name]
  }
  update(name) {
    if (this.subscriber) {
      if (name)
        this.subscriber.setState({ editors: this.editors, activeTab: name })
      else this.subscriber.setState({ editors: this.editors })
    }
  }
  subscribe(subscriber) {
    this.subscriber = subscriber
    return this.editors
  }
}

const api = new API()

export default api
