import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Watch from './Watch'
import autobind from 'autobind-decorator'
import WithFilter from '../WithFilter'
import Result from './Result'

@withGraphQL(gql`
  query getChart($chartId: ID) {
    chart(chartId: $chartId) {
      _id
      title
      name
      environmentId
      chartTypeId
      collectionId
      allowsNoFilter
      filterByDefault
      filters {
        _id
        title
        schema: serializedSchema(includeParameters: true)
        formSchema: serializedSchema(includeParameters: false)
      }
    }
  }
`)
export default class Chart extends React.Component {
  static propTypes = {
    chart: PropTypes.object,
    parameters: PropTypes.object
  }

  @autobind
  refetch() {
    this.result.props.refetch()
  }

  renderWatch() {
    const {collectionId, environmentId} = this.props.chart
    if (collectionId) {
      return (
        <Watch collectionId={collectionId} environmentId={environmentId} onUpdate={this.refetch} />
      )
    }
  }

  @autobind
  renderResult({filterId, filterOptions}) {
    const {chart, parameters} = this.props
    return (
      <Result
        setRef={result => (this.result = result)}
        filterId={filterId}
        filterOptions={filterOptions}
        chartId={chart._id}
        params={parameters}
      />
    )
  }

  render() {
    const {chart, parameters} = this.props
    return (
      <div className={styles.container}>
        {this.renderWatch()}
        <div className={styles.title}>{chart.title}</div>
        <WithFilter
          filters={chart.filters}
          allowsNoFilter={chart.allowsNoFilter}
          parameters={parameters}
          filterByDefault={chart.filterByDefault}>
          {this.renderResult}
        </WithFilter>
      </div>
    )
  }
}
