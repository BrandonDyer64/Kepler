import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import './App.css'
import { Button } from './Material'
import TitleBar from './Components/TitleBar'
import SnackBar, { snackBarChannel } from './Components/SnackBar'

import Init from './Windows/Startup'

const localStorage = window.localStorage

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { isDarkTheme: localStorage.getItem('isDarkTheme') === 'true' }
    console.log(this.state)
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
          <SnackBar />
        </Router>
      </div>
    )
  }
}

export default App
