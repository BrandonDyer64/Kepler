import _ from 'lodash'

class API {
  constructor() {
    this.editors = {}
    this.subscriber = null
  }
  addEditor(name, editor) {
    this.editors[name] = editor
    this.update()
  }
  removeEditor(name) {
    delete this.editors[name]
    this.update()
  }
  update() {
    this.subscriber.setState({ editors: this.editors })
  }
  subscribe(subscriber) {
    this.subscriber = subscriber
  }
}

export default api
