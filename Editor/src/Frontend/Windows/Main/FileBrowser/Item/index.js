import React from 'react'
import styles from './index.module.css'
import cx from 'classnames'

const remote = window.require('electron').remote
const fs = remote.require('fs')
const path = remote.require('path')

export default class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      subDirs: [],
      isOpen: !!props.open,
      isDir: false,
      icon: 'circle-outline'
    }
  }
  componentDidMount() {
    fs.readdir(this.props.path, (err, files) => {
      if (err || !files) {
        this.setState({ isDir: false })
        return
      } else {
        this.setState({ isDir: true })
      }
      const subDirs = files
        .filter(file => {
          const ext = path.extname(`${this.props.path}/${file}`)
          return ext === `json` || ext === ''
        })
        .map(file => (
          <Item
            key={`FE_${this.props.path}-/-${file}`}
            title={file}
            path={`${this.props.path}/${file}`}
          />
        ))
      this.setState({ subDirs })
    })
  }
  onClick = () => {
    this.setState(s => ({ isOpen: !s.isOpen }))
  }
  render() {
    const { title } = this.props
    const { subDirs, isOpen, isDir, icon } = this.state
    return (
      <li className={cx(styles.Item)}>
        <span className={styles.title} onClick={this.onClick}>
          {isDir && (
            <span
              className={`mdi mdi-${isOpen ? 'chevron-down' : 'chevron-right'}`}
            />
          )}
          <span className={`mdi mdi-${isDir ? 'folder' : icon}`} />
          <span className={styles.name}>{title}</span>
        </span>
        {isDir && isOpen && <ol>{subDirs}</ol>}
      </li>
    )
  }
}
