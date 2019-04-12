import React from 'react'
import _ from 'lodash'
import Script from '../Editors/Script'

class API {
  constructor() {
    this.editors = {
      test: { icon: 'nodejs', component: <Script /> }
    }
    this.subscriber = null
  }
  addEditor(name, editor) {
    if (name in this.editors) return // We already have this editor
    this.editors[name] = editor
    this.update()
  }
  removeEditor(name) {
    delete this.editors[name]
    this.update()
  }
  update() {
    if (this.subscriber) {
      this.subscriber.setState({ editors: this.editors })
    }
  }
  subscribe(subscriber) {
    this.subscriber = subscriber
    return this.editors
  }
}

const api = new API()

export default api
