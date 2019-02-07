import React from 'react'
import styles from './styles.css'
import Watch from './Watch'
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
      filterByDefault
      indicatorType {
        _id
        requireCollection
      }
      filters {
        _id
        title
        schema: serializedSchema(includeParameters: true)
        formSchema: serializedSchema(includeParameters: false)
      }
    }
  }
`)
export default class Indicator extends React.Component {
  static propTypes = {
    indicator: PropTypes.object,
    parameters: PropTypes.object,
    fullSize: PropTypes.bool,
    timezone: PropTypes.string
  }

  @autobind
  refetch() {
    if (!this.result) return null
    this.result.props.refetch()
  }

  @autobind
  renderResult({filterId, filterOptions}) {
    return (
      <Result
        setRef={result => (this.result = result)}
        indicator={this.props.indicator}
        indicatorId={this.props.indicator._id}
        filterId={filterId}
        filterOptions={filterOptions}
        fullSize={this.props.fullSize}
        params={this.props.parameters}
        timezone={this.props.timezone}
      />
    )
  }

  renderForCollection() {
    const {indicator, parameters} = this.props
    if (!indicator.indicatorType) return
    if (!indicator.indicatorType.requireCollection) return
    return (
      <div>
        <WithFilter
          filters={indicator.filters}
          allowsNoFilter={indicator.allowsNoFilter}
          parameters={parameters}
          filterByDefault={indicator.filterByDefault}>
          {this.renderResult}
        </WithFilter>
        <Watch
          environmentId={indicator.environmentId}
          collectionId={indicator.collectionId}
          onUpdate={this.refetch}
        />
      </div>
    )
  }

  renderWithoutCollection() {
    const {indicator} = this.props
    if (!indicator.indicatorType || indicator.indicatorType.requireCollection) return
    return this.renderResult({})
  }

  render() {
    const {indicator, fullSize} = this.props
    if (!indicator) return
    return (
      <div className={`${styles.container} ${fullSize && 'center'}`}>
        <div className={styles.header}>
          {indicator && <div className={styles.title}>{indicator.title}</div>}
        </div>
        {this.renderForCollection()}
        {this.renderWithoutCollection()}
      </div>
    )
  }
}
