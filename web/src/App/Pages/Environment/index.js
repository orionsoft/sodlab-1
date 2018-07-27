import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Settings from '../Admin/Settings'
import Styles from './Styles'
import Layout from './Layout'
import View from './View'
import NotFound from './NotFound'
import forceLogin from 'App/helpers/auth/forceLogin'
import Watch from './Watch'

@forceLogin
@withEnvironmentId
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
    }
    views(limit: null, environmentId: $environmentId) {
      items {
        _id
        path
      }
    }
  }
`)
export default class Environment extends React.Component {
  static propTypes = {
    environment: PropTypes.object,
    views: PropTypes.object
  }

  componentDidMount() {
    const {environment} = this.props
    document.title = `${environment.name}`
  }

  renderViews() {
    const {environment} = this.props
    return this.props.views.items.map(view => {
      return (
        <Route
          key={view._id}
          path={view.path}
          exact
          component={({match}) => (
            <View params={match.params} viewId={view._id} environmentId={environment._id} />
          )}
        />
      )
    })
  }

  renderSwitch() {
    return (
      <Switch>
        <Route path="/settings" component={Settings} />
        {this.renderViews()}
        <Route path="*" component={NotFound} />
      </Switch>
    )
  }

  render() {
    if (!this.props.environment) return null
    return (
      <div className={styles.container}>
        <Layout>{this.renderSwitch()}</Layout>
        <Watch environmentId={this.props.environment._id} />
        <Styles />
      </div>
    )
  }
}
