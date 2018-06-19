import React from 'react'
import styles from './styles.css'
import Container from 'orionsoft-parts/lib/components/Container'

export default class NotFound extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Container>
          <div className={styles.text}>No se encontró lo que buscabas</div>
        </Container>
      </div>
    )
  }
}
