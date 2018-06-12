import React from 'react'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

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
    environment: PropTypes.object
  }

  render() {
    if (!this.props.environment) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs past={{'/admin': 'Admin', '/admin/environments': 'Ambientes'}}>
          {this.props.environment.name}
        </Breadcrumbs>
      </div>
    )
  }
}
