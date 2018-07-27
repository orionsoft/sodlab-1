import React from 'react'
import styles from './styles.css'

export default class View extends React.Component {
  static propTypes = {

  }

  render () {
    return (
      <div className={styles.container}>
        View
      </div>
    )
  }
}
