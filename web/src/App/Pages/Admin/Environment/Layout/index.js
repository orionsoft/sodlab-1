import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Menu from './Menu'
import Container from 'orionsoft-parts/lib/components/Container'
import links from '../links'

export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    environment: PropTypes.object
  }

  render() {
    return (
      <div className={styles.container} style={{minHeight: window.innerHeight}}>
        <Menu links={links} environment={this.props.environment} />
        <div className={styles.content}>
          <Container>
            <div className={styles.innerContent} style={{minHeight: window.innerHeight}}>
              {this.props.children}
            </div>
          </Container>
        </div>
      </div>
    )
  }
}
