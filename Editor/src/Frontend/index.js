import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'
import TitleBar from './Components/TitleBar'
import SnackBar, { snackBarChannel } from './Components/SnackBar'
import consoleAPI from './Windows/Main/Editors/Console/api'

import Init from './Windows/Startup'
import Main from './Windows/Main'

const localStorage = window.localStorage

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { isDarkTheme: localStorage.getItem('isDarkTheme') === 'true' }
  }
  componentDidMount() {
    consoleAPI.addCommand('toggleDarkTheme', (args, print, done) => {
      this.toggleDarkTheme()
      print('toggled')
      done()
    })
  }
  toggleDarkTheme() {
    localStorage.setItem('isDarkTheme', !this.state.isDarkTheme)
    this.setState(state => ({ isDarkTheme: !state.isDarkTheme }))
    var data = {
      message: 'Dark theme toggled'
    }
    snackBarChannel.open(data)
  }
  render() {
    return (
      <div className={`App ${this.state.isDarkTheme ? 'dark' : 'light'}-theme`}>
        <Router>
          <TitleBar onLightToggle={() => this.toggleDarkTheme()}>
            Kepler Engine
          </TitleBar>
          <Route path='/init' component={Init} />
          <Route path='/main' component={Main} />
          <SnackBar />
        </Router>
      </div>
    )
  }
}

export default App
