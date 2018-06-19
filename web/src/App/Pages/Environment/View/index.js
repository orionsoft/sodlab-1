import React from 'react'
import styles from './styles.css'
import Container from 'orionsoft-parts/lib/components/Container'
import PropTypes from 'prop-types'

export default class View extends React.Component {
  static propTypes = {
    params: PropTypes.object,
    view: PropTypes.object
  }

  render() {
    return (
      <div className={styles.container}>
        <Container>
          <pre>{JSON.stringify(this.props, null, 2)}</pre>
        </Container>
      </div>
    )
  }
}
