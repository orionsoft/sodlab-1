import React from 'react'
import styles from './styles.css'
import Breadcrumbs from '../Breadcrumbs'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Button from 'orionsoft-parts/lib/components/Button'
import {withRouter} from 'react-router'
import autobind from 'autobind-decorator'

@withRouter
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
    }
  }
`)
export default class Main extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    environment: PropTypes.object
  }

  @autobind
  goToEnv() {
    localStorage.setItem('debugEnvironment', this.props.environment._id)
    this.props.history.replace('/app')
  }

  render() {
    if (!this.props.environment) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs />
        <Button onClick={this.goToEnv}>Ir al Ambiente</Button>
      </div>
    )
  }
}
