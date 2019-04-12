import React from 'react'
import editorAPI from '../Editor/api'
import _ from 'lodash'

import Console from '../Editors/Console'

export default [
  {
    name: 'save',
    icon: 'content-save-outline',
    tooltip: 'Save',
    menu: [
      {
        name: 'test',
        onClick: () => {
          console.log('save passed')
        }
      }
    ]
  },
  {
    name: 'console',
    icon: 'console',
    tooltip: 'Console',
    onClick: () => {
      editorAPI.addEditor('console-' + _.uniqueId(), {
        title: 'Console',
        icon: 'console-line',
        component: <Console />
      })
    }
  },
  {
    name: 'notsave',
    icon: 'cast',
    tooltip: 'Cast to device',
    onClick: () => {
      console.log('save 2')
    }
  }
]
