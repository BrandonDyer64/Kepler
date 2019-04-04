import React from 'react'
import ReactDOM from 'react-dom'
import '../node_modules/material-design-lite/material.min.css'
import '../node_modules/material-design-lite/material.min.js'
import '../node_modules/@mdi/font/css/materialdesignicons.min.css'
import './index.css'
import Frontend from './Frontend'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<Frontend />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
