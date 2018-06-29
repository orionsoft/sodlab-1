import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import Breadcrumbs from '../../Breadcrumbs'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Basic from './Basic'
import Conditions from './Conditions'

@withGraphQL(gql`
  query getFilter($filterId: ID) {
    filter(filterId: $filterId) {
      _id
      name
    }
  }
`)
export default class Filter extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    filter: PropTypes.object
  }

  render() {
    if (!this.props.filter) return null
    return (
      <div className={styles.container}>
        <div className={styles.container}>
          <Breadcrumbs>{this.props.filter.name}</Breadcrumbs>
          <Basic filterId={this.props.filter._id} />
          <Conditions filterId={this.props.filter._id} />
        </div>
      </div>
    )
  }
}
