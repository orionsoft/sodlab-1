import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Home from './Home'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

@withEnvironmentId
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
    }
  }
`)
export default class Environment extends React.Component {
  static propTypes = {
    environment: PropTypes.object
  }

  renderNoEnvironment() {
    return <div className={styles.notFound}>No se encontró el ambiente</div>
  }

  render() {
    if (!this.props.environment) return this.renderNoEnvironment()
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/app" exact component={Home} />
        </Switch>
      </div>
    )
  }
}
