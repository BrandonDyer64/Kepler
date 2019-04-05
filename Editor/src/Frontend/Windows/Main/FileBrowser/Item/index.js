import React from 'react'
import styles from './index.module.css'
import cx from 'classnames'

export default props => {
  const { title, children } = props
  return (
    <li className={cx(styles.Item, { [styles.active]: !!props.active })}>
      <span className={styles.title}>
        <span className={`mdi mdi-${props.icon}`} />
        <span className={styles.name}>{title}</span>
      </span>
      {children && <ol>{children}</ol>}
    </li>
  )
}
