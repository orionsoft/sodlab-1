import React from 'react'
import authRouteRegex from './Auth/routeRegex'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'
import DynamicComponent from 'App/components/DynamicComponent'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'
import includes from 'lodash/includes'
import ErrorPage from './ErrorPage'
import withRoles from 'App/helpers/auth/withRoles'
import withUserId from 'App/helpers/auth/withUserId'

const adminHosts = ['localhost:3010', 'beta.sodlab.com', 'admin.sodlab.com']

@withRouter
@withEnvironmentId
@withUserId
@withRoles
export default class Component extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    location: PropTypes.object,
    environmentId: PropTypes.string,
    roles: PropTypes.array,
    userId: PropTypes.string
  }

  shouldRenderNotFound() {
    if (this.props.environmentId) return false
    return !includes(adminHosts, window.location.host)
  }

  shouldRenderNotAllowed() {
    if (!this.props.userId) {
      this.props.history.replace({
        pathname: '/login'
      })
      return true
    }
    const isInAdmin = includes(adminHosts, window.location.host)
    if (isInAdmin) {
      if (!includes(this.props.roles, 'admin')) return true
      return false
    } else {
      console.log('Should check if the user has access to this env')
      return false
    }
  }

  renderNotFound() {
    return <ErrorPage text="No se encontró el ambiente" />
  }

  renderNotAllowed() {
    return <ErrorPage text="No tienes permisos para estar aquí" />
  }

  render() {
    if (this.shouldRenderNotFound()) return this.renderNotFound()
    if (authRouteRegex.test(this.props.location.pathname)) {
      const Component = DynamicComponent(() => import('./Auth'))
      return <Component />
    } else {
      if (this.shouldRenderNotAllowed()) return this.renderNotAllowed()

      const isInAdmin = includes(adminHosts, window.location.host)
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
