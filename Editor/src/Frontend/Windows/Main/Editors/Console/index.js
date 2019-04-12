import React from 'react'
import styles from './index.module.css'
import './index.css'
import api from './api'
import idmk from '../../../../Utils/Id'

export default class Console extends React.Component {
  constructor() {
    super()
    this.state = { lines: [''], lineValue: '', id: idmk(this) }
  }
  handleChange(e) {
    this.setState({ lineValue: e.target.value })
  }
  handleKeyDown(e) {
    console.log(e.key)
    if (e.key === 'Enter') {
      this.input.value = ''
      api.call(
        this.state.lineValue,
        line => {
          this.setState(s => ({
            lines: [...s.lines, line]
          }))
        },
        () => {}
      )
    }
  }
  render() {
    const { lines, id } = this.state
    return (
      <div className={styles.console}>
        <div className={styles.lines}>
          {lines.map((line, i) => (
            <div key={id(`line-${i}`)}>
              {line}
              <br />
            </div>
          ))}
        </div>
        <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
          $&nbsp;&gt;&nbsp;
          <input
            ref={el => (this.input = el)}
            className='mdl-textfield__input'
            type='text'
            onChange={e => this.handleChange(e)}
            onKeyDown={e => this.handleKeyDown(e)}
            id='console-input'
          />
        </div>
      </div>
    )
  }
}
