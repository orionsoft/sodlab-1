import React from 'react'
import Breadcrumbs from 'App/components/Breadcrumbs'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import links from '../links'
import pickFromString from 'App/helpers/strings/pickFromString'

@withRouter
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
    }
  }
`)
export default class EnvironmenBreadcrumbs extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    children: PropTypes.node,
    environment: PropTypes.object,
    right: PropTypes.node
  }

  getRoot() {
    const {environment} = this.props
    const {pathname} = this.props.history.location
    const activePath = pickFromString(pathname, /^\/\w+(\/\w+)?/)
    const getPath = path => `/${environment._id}${path}`
    const items = links.map((link, index) => {
      const path = getPath(link.path)
      return {label: link.title, path, active: activePath === path}
    })
    return items.find(item => item.active)
  }

  render() {
    const {environment, children} = this.props
    if (!environment) return null
    const root = this.getRoot()
    if (!root) return null

    const content = children || root.label
    const past = children ? {[root.path]: root.label} : null

    return (
      <div>
        <Breadcrumbs right={this.props.right} past={past}>
          {content}
        </Breadcrumbs>
        <div className="divider" />
      </div>
    )
  }
}
