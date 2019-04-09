class Api {
  constructor() {
    this.buttons = [{ a: 'a' }, { b: 'b' }]
    this.subscriber = null
  }
  addButton(name, button) {
    button.name = name
    this.buttons[name] = button
    this.update()
  }
  removeButton(name) {
    delete this.buttons[name]
    this.update()
  }
  subscribe(subscriber) {
    this.subscriber = subscriber
  }
  update() {
    if (!this.subscriber) return
    // Make buttons into a sorted array
    const buttons = Object.keys(this.buttons)
      .map(i => this.buttons[i])
      .sort((a, b) => (a.sort || 1) - (b.sort || 1))
    // Notify the toolbar
    this.subscriber.updateButtons(buttons)
  }
}

const api = new Api()

export default api
