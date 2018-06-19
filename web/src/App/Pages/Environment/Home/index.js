import React from 'react'
import styles from './styles.css'
import Container from 'orionsoft-parts/lib/components/Container'

export default class Home extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Container>hello</Container>
      </div>
    )
  }
}
