class API {
  constructor() {
    this.editors = []
    this.subscriber = null
  }
  addEditor(editor) {}
  subscribe(subscriber) {
    this.subscriber = subscriber
  }
}

export default api
