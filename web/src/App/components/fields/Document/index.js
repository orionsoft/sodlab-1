import React from 'react'
import styles from './styles.css'

export default class Document extends React.Component {
  static propTypes = {

  }

  render () {
    return (
      <div className={styles.container}>
        Document
      </div>
    )
  }
}
