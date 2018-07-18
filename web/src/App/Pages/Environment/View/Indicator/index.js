import React from 'react'
import styles from './styles.css'
import Watch from '../Table/Watch'
import WithFilter from '../WithFilter'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import Result from './Result'

@withGraphQL(gql`
  query getTable($indicatorId: ID) {
    indicator(indicatorId: $indicatorId) {
      _id
      title
      collectionId
      environmentId
      allowsNoFilter
      filters {
        _id
        name
        schema: serializedSchema
      }
    }
  }
`)
export default class Indicator extends React.Component {
  static propTypes = {
    indicator: PropTypes.object,
    parameters: PropTypes.object
  }

  @autobind
  renderResult({filterId, filterOptions}) {
    return (
      <Result
        indicator={this.props.indicator}
        indicatorId={this.props.indicator._id}
        filterId={filterId}
        filterOptions={filterOptions}
      />
    )
  }

  render() {
    const {indicator, parameters} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{indicator.title}</div>
        </div>
        <WithFilter
          filters={indicator.filters}
          allowsNoFilter={indicator.allowsNoFilter}
          parameters={parameters}>
          {this.renderResult}
        </WithFilter>
        <Watch environmentId={indicator.environmentId} collectionId={indicator.collectionId} />
      </div>
    )
  }
}
