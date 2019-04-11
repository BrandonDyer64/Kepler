import React from 'react'
import './index.css'
import styles from './index.module.css'
import Script from '../Editors/Script'

export default class Editor extends React.Component {
  render() {
    return (
      <div className='mdl-tabs mdl-js-tabs'>
        <div className='mdl-tabs__tab-bar'>
          <a href='#starks-panel' className='mdl-tabs__tab is-active'>
            <span className='mdi mdi-nodejs' />
            &nbsp;Test.js
          </a>
          <a href='#lannisters-panel' className='mdl-tabs__tab'>
            <span className='mdi mdi-language-typescript' />
            &nbsp;Test2.ts
          </a>
          <a href='#targaryens-panel' className='mdl-tabs__tab'>
            <span className='mdi mdi-alpha-k-box-outline' />
            &nbsp;Test3.kt
          </a>
        </div>
        <div className='mdl-tabs__panel is-active' id='starks-panel'>
          <Script />
        </div>
        <div className='mdl-tabs__panel' id='lannisters-panel'>
          <ul>
            <li>Tywin</li>
            <li>Cersei</li>
            <li>Jamie</li>
            <li>Tyrion</li>
          </ul>
        </div>
        <div className='mdl-tabs__panel' id='targaryens-panel'>
          <ul>
            <li>Viserys</li>
            <li>Daenerys</li>
          </ul>
        </div>
      </div>
    )
  }
}
