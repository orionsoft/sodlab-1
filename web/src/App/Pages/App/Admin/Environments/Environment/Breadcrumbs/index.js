import React from 'react'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import links from '../links'
import Select from 'orionsoft-parts/lib/components/fields/Select'
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

  renderMenu() {
    const {environment} = this.props
    const getPath = path => `/admin/environments/${environment._id}${path}`
    const items = links.map((link, index) => {
      return {label: index === 0 ? environment.name : link.title, value: getPath(link.path)}
    })
    const {pathname} = this.props.history.location
    const value = pickFromString(pathname, /^\/\w+\/\w+\/\w+(\/\w+)?/)
    return (
      <div className={styles.menu}>
        <div className={styles.menuSelect}>
          <Select
            value={value}
            options={items}
            passProps={{placeholder: 'Menu'}}
            onChange={path =>
              path ? this.props.history.push(path) : this.props.history.push(getPath(''))
            }
          />
        </div>
      </div>
    )
  }

  render() {
    const {environment} = this.props
    if (!environment) return null
    let past = {
      '/admin': 'Admin',
      '/admin/environments': 'Ambientes'
    }
    past = {...past, poop: this.renderMenu()}
    return (
      <div>
        <Breadcrumbs right={this.props.right} past={past}>
          {this.props.children}
        </Breadcrumbs>
        <div className="divider" />
      </div>
    )
  }
}
