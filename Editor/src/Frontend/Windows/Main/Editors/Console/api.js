class API {
  constructor() {
    this.commands = {
      testCommand: (args, lineback, done) => {
        let running = true
        new Promise((resolve, reject) => {
          let its = 0
          let id = setInterval(() => {
            lineback(its++)
            if (its > 20 || !running) {
              clearInterval(id)
              resolve()
            }
          }, 50)
        })
        return () => (running = false)
      }
    }
  }
  addCommand(name, callback) {
    this.commands[name] = callback
  }
  call(string, lineback, done) {
    const args = string.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/)
    if (args[0] in this.commands) {
      return this.commands[args[0]](args.splice(0, 1), lineback, done)
    } else {
      lineback(`Could not find command: ${args[0]}`)
      done()
    }
  }
}

const api = new API()

export default api
