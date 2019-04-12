import React from 'react'
import cx from 'classnames'
import api from './api'
import './index.css'
import styles from './index.module.css'
import Script from '../Editors/Script'
import idmk from '../../../Utils/Id'

export default class Editor extends React.Component {
  constructor() {
    super()
    this.state = { editors: api.subscribe(this), id: idmk(this) }
  }
  render() {
    const { editors, id } = this.state
    return (
      <div className='mdl-tabs mdl-js-tabs'>
        <div className='mdl-tabs__tab-bar'>
          {Object.keys(editors).map((tabName, i) => (
            <a
              href={'#' + id(tabName)}
              className='mdl-tabs__tab'
              key={'#' + id(tabName)}
            >
              <span className={styles.tabNameContainer}>
                <span className={'mdi mdi-' + editors[tabName].icon} />
                {editors[tabName].title}
              </span>
              <span
                className='mdi mdi-close'
                onClick={() => api.removeEditor(tabName)}
              />
            </a>
          ))}
        </div>
        {Object.keys(editors).map((name, i) => (
          <div className='mdl-tabs__panel' id={id(name)} key={id(name)}>
            {editors[name].component}
          </div>
        ))}
      </div>
    )
  }
}
