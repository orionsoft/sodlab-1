import * as allIcons from 'react-icons/lib/md'
import snakeCase from 'lodash/snakeCase'
import React from 'react'

export default Object.keys(allIcons).map(key => {
  const snake = snakeCase(key.replace(/^.{2}/, '')).replace(/_/g, ' ')
  const name = snake[0].toUpperCase() + snake.substring(1)
  const Icon = allIcons[key]
  return {
    label: (
      <span>
        <span style={{marginRight: 5}}>
          <Icon />
        </span>{' '}
        {name}
      </span>
    ),
    value: key
  }
})
