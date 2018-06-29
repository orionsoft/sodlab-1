import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'
import autobind from 'autobind-decorator'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withRouter
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
      logo {
        _id
        url
      }
    }
  }
`)
@withMessage
export default class Main extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    environment: PropTypes.object
  }

  @autobind
  goToEnv() {
    window.open('http://' + this.props.environment.url)
  }

  render() {
    if (!this.props.environment) return null
    return (
      <div className={styles.container}>
        {this.props.environment.logo ? (
          <div className={styles.logo}>
            <img src={this.props.environment.logo.url} alt="logo" />
          </div>
        ) : (
          <div className={styles.name}>{this.props.environment.name}</div>
        )}
      </div>
    )
  }
}
