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
      everOpened: !!props.open,
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
      // Find my files
      const subDirs = files
        .filter(file => {
          // Filter out everything that isn't a directory or json
          const ext = path.extname(this.getSubFileName(file))
          return ext === '.json' || ext === ''
        })
        .map(file => (
          // Create item list
          <Item
            key={`FE_${this.props.path}-/-${file}`}
            title={file}
            path={this.getSubFileName(file)}
            onPathLoad={this.props.onPathLoad}
          />
        ))
      this.setState({ subDirs })
    })
  }
  getSubFileName(file) {
    return `${this.props.path}${path.sep}${file}`
  }
  onClick = () => {
    if (this.state.isDir) {
      this.setState(s => ({ isOpen: !s.isOpen, everOpened: true }))
    } else {
      this.props.onPathLoad(this.props.path)
    }
  }
  render() {
    const { title } = this.props
    const { subDirs, isOpen, isDir, icon, everOpened } = this.state
    return (
      <li className={cx(styles.Item)}>
        <span className={styles.title} onClick={this.onClick}>
          <span
            className={cx(
              'mdi',
              `mdi-${isOpen ? 'chevron-down' : 'chevron-right'}`,
              { [styles.hidden]: !isDir }
            )}
          />
          <span className={`mdi mdi-${isDir ? 'folder' : icon}`} />
          <span className={styles.name}>{title}</span>
        </span>
        {isDir && everOpened && (
          <ol style={{ display: isOpen ? 'block' : 'none' }}>{subDirs}</ol>
        )}
      </li>
    )
  }
}
