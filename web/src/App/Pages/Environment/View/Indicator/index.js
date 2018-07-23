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
      indicatorType {
        _id
        requireCollection
      }
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
  refetch() {
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
      />
    )
  }

  renderForCollection() {
    const {indicator, parameters} = this.props
    if (!indicator.indicatorType.requireCollection) return
    return (
      <div>
        <WithFilter
          filters={indicator.filters}
          allowsNoFilter={indicator.allowsNoFilter}
          parameters={parameters}>
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
    if (indicator.indicatorType.requireCollection) return
    return this.renderResult({})
  }

  render() {
    const {indicator} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{indicator.title}</div>
        </div>
        {this.renderForCollection()}
        {this.renderWithoutCollection()}
      </div>
    )
  }
}
