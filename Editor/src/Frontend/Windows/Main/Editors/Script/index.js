import React from 'react'
import CodeMirror from 'react-codemirror'
import 'codemirror/mode/jsx/jsx'
import '../../../../../../node_modules/codemirror/lib/codemirror.css'
import '../../../../../../node_modules/codemirror/theme/material.css'
import './index.css'
import styles from './index.module.css'

export default props => (
  <div className={styles.script}>
    <CodeMirror
      value='a'
      onChange={() => {}}
      options={{
        mode: 'jsx',
        theme: 'material',
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true
      }}
    />
  </div>
)
