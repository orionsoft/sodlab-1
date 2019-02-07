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
import Home from './Home'
import withRoles from 'App/helpers/auth/withRoles'
import NotAllowed from 'App/Pages/Auth/NotAllowed'

@withRoles
@forceLogin
@withEnvironmentId
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
      intercomId
      backgroundColor
      timezone
    }
    views(limit: null, environmentId: $environmentId) {
      items {
        _id
        path
      }
    }
    me {
      _id
      environments {
        _id
      }
    }
  }
`)
export default class Environment extends React.Component {
  static propTypes = {
    environment: PropTypes.object,
    views: PropTypes.object,
    environmentId: PropTypes.string,
    roles: PropTypes.array,
    me: PropTypes.object
  }

  hasAccess() {
    const {environment, me, roles} = this.props
    if (!me) return false
    const environmentsIds = me.environments.map(env => {
      return env._id
    })
    const has = roles.includes('superAdmin') || environmentsIds.includes(environment._id)
    return has
  }

  componentDidMount() {
    const {environment} = this.props
    if (this.hasAccess()) {
      document.title = `${environment.name}`
    } else {
      document.title = `Acceso denegado`
    }
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
            <View
              params={match.params}
              viewId={view._id}
              environmentId={environment._id}
              intercomId={environment.intercomId}
              timezone={environment.timezone}
            />
          )}
        />
      )
    })
  }

  renderSwitch() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/settings" component={Settings} />
        {this.renderViews()}
        <Route path="*" component={NotFound} />
      </Switch>
    )
  }

  render() {
    const {environment} = this.props
    if (!environment) return null

    if (!this.hasAccess()) {
      return <NotAllowed />
    }

    return (
      <div className={styles.container} style={{backgroundColor: environment.backgroundColor}}>
        <Layout>{this.renderSwitch()}</Layout>
        <Watch environmentId={this.props.environment._id} />
        <Styles />
      </div>
    )
  }
}
