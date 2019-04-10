class Api {
  constructor() {
    this.buttons = [{ name: 'save' }, { name: 'notsave' }]
    this.subscriber = null
  }
  addButton(button, sort) {
    this.addButtons([button], sort)
  }
  addButtons(buttons, sort) {
    this.buttons = [...this.buttons, ...buttons]
    buttons.forEach(b => (b.sort = sort))
    this.buttons
      .map(i => this.buttons[i])
      .sort((a, b) => (a.sort || 1) - (b.sort || 1))
      .forEach((button, i, buttons) => {
        button.sort = i / buttons.length
      })
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
    // Notify the toolbar
    this.subscriber.updateButtons(this.buttons)
  }
}

const api = new Api()

export default api
