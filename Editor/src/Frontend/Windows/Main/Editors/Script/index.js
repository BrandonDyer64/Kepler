import React from 'react'
import CodeMirror from 'react-codemirror'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/lua/lua'
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
        mode: props.mode || 'text/x-kotlin',
        theme: 'material',
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true
      }}
    />
  </div>
)
