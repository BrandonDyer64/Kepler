class Api {
  constructor() {
    this.buttons = [
      {
        name: 'save',
        icon: 'content-save-outline',
        tooltip: 'Save',
        menu: [
          {
            name: 'test',
            onClick: () => {
              console.log('save passed')
            }
          }
        ]
      },
      {
        name: 'notsave',
        icon: 'cast',
        tooltip: 'Cast to device',
        onClick: () => {
          console.log('save 2')
        }
      }
    ]
    this.subscriber = null
  }
  addButton(button, sort) {
    this.addButtons([button], sort)
  }
  addButtons(buttons, sort) {
    this.buttons = [...buttons, ...this.buttons]
    buttons.forEach(b => (b.sort = sort))
    this.buttons = this.buttons
      .map(i => this.buttons[i])
      .sort((a, b) => (a.sort || 1) - (b.sort || 1))
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