import React from 'react'
import _ from 'lodash'
import Script from '../Editors/Script'

class API {
  constructor() {
    this.editors = {
      test: { title: 'Test.cpp', icon: 'language-cpp', component: <Script /> },
      test1: { title: 'Test.cpp', icon: 'language-cpp', component: <Script /> },
      test2: { title: 'Test.cpp', icon: 'language-cpp', component: <Script /> },
      test3: { title: 'Test.cpp', icon: 'language-cpp', component: <Script /> },
      test4: { title: 'Test.cpp', icon: 'language-cpp', component: <Script /> },
      test5: { title: 'Test.cpp', icon: 'language-cpp', component: <Script /> }
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
