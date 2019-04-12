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
  componentDidMount() {
    this.input.focus()
  }
  handleChange(e) {
    this.setState({ lineValue: e.target.value })
  }
  handleKeyDown(e) {
    console.log(e.key)
    if (e.key === 'Enter') {
      this.input.value = ''
      this.setState(s => ({
        isCommandRunning: true,
        lines: [
          ...s.lines,
          <>
            <span style={{ fontWeight: 'bold' }}>Kepler:~$ </span>
            {this.state.lineValue}
          </>
        ]
      }))
      api.call(
        this.state.lineValue,
        line => {
          this.setState(s => ({
            lines: [...s.lines, line]
          }))
        },
        () => {
          this.setState({ isCommandRunning: false })
          this.input.focus()
        }
      )
    }
  }
  render() {
    const { lines, id, isCommandRunning } = this.state
    return (
      <div className={styles.console}>
        <div className={styles.lines}>
          {lines.map((line, i) => (
            <div key={id(`line-${i}`)}>
              {line}
              <br />
            </div>
          ))}
          {!isCommandRunning && (
            <div className='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>
              <span style={{ fontWeight: 'bold' }}>Kepler:~$&nbsp;</span>
              <input
                ref={el => (this.input = el)}
                className='mdl-textfield__input'
                type='text'
                onChange={e => this.handleChange(e)}
                onKeyDown={e => this.handleKeyDown(e)}
                id='console-input'
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}
