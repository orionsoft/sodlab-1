import React from 'react'
import authRouteRegex from './Auth/routeRegex'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'
import DynamicComponent from 'App/components/DynamicComponent'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'
import ErrorPage from './ErrorPage'
import withRoles from 'App/helpers/auth/withRoles'
import withUserId from 'App/helpers/auth/withUserId'
import includes from 'lodash/includes'
import NotAllowed from 'App/Pages/Auth/NotAllowed'
import withEnvironment from 'App/helpers/auth/withEnvironment'

const adminHosts = ['localhost:3010', 'beta.sodlab.com', 'dashboard.sodlab.com']

@withRouter
@withEnvironmentId
@withUserId
@withRoles
@withEnvironment
export default class Component extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    environmentId: PropTypes.string,
    roles: PropTypes.array,
    userId: PropTypes.string,
    environmentUserAuthorization: PropTypes.bool
  }

  shouldRenderNotFound() {
    if (this.props.environmentId) return false
    return !adminHosts.includes(window.location.host)
  }

  shouldRenderNotAllowed() {
    if (!this.props.userId) {
      this.props.history.replace({
        pathname: '/login'
      })
      return true
    }
    const isInAdmin = adminHosts.includes(window.location.host)
    if (isInAdmin) {
      if (!includes(this.props.roles, 'admin') && !includes(this.props.roles, 'superAdmin')) {
        return true
      }
      return false
    } else {
      if (!this.props.userId) return null
      if (includes(this.props.roles, 'superAdmin')) return false
      if (this.props.environmentUserAuthorization) return false
      return <NotAllowed />
    }
  }

  renderNotFound() {
    return <ErrorPage text="No se encontró el ambiente" />
  }

  renderNotAllowed() {
    return <NotAllowed />
  }

  render() {
    if (this.shouldRenderNotFound()) return this.renderNotFound()
    if (authRouteRegex.test(this.props.location.pathname)) {
      const Component = DynamicComponent(() => import('./Auth'))
      return <Component />
    } else {
      if (this.shouldRenderNotAllowed()) return this.renderNotAllowed()
      const isInAdmin = adminHosts.includes(window.location.host)
      if (isInAdmin && this.props.location.pathname === '/') {
        this.props.history.replace('/admin')
      }
      if (isInAdmin) {
        const Admin = DynamicComponent(() => import('./Admin'))
        return <Admin />
      } else {
        const Environment = DynamicComponent(() => import('./Environment'))
        return <Environment />
      }
    }
  }
}
