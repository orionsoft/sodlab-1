import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import {Route, Switch} from 'react-router-dom'
import {withRouter} from 'react-router'
import Collections from './Collections'
import Main from './Main'
import Forms from './Forms'
import Configuration from './Configuration'
import Views from './Views'

@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
    }
  }
`)
@withRouter
export default class Environment extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    environment: PropTypes.object
  }

  render() {
    const {environment} = this.props
    if (!environment) return null
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/admin/environments/:environmentId" exact component={Main} />
          <Route path="/admin/environments/:environmentId/collections" component={Collections} />
          <Route path="/admin/environments/:environmentId/forms" component={Forms} />
          <Route path="/admin/environments/:environmentId/views" component={Views} />
          <Route
            path="/admin/environments/:environmentId/configuration"
            component={Configuration}
          />
        </Switch>
      </div>
    )
  }
}
