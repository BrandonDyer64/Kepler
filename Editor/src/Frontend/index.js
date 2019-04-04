import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import logo from './logo.svg'
import './App.css'
import { Button } from './Material'

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
    var snackbarContainer = document.querySelector('#snackbar')
    var showSnackbarButton = document.querySelector('#dark-mode-button')
    var data = {
      message: 'Button color changed.',
      timeout: 2000,
      actionHandler: () => {},
      actionText: 'Undo'
    }
    snackbarContainer.MaterialSnackbar.showSnackbar(data)
  }
  render() {
    return (
      <Router>
        <>
          <p>test</p>
          <Route path='/init' component={Init} />
        </>
      </Router>
    )
  }
}

export default App
