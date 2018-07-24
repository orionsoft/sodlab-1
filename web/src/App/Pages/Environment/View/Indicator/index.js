import React from 'react'
import styles from './styles.css'
import Watch from './Watch'
import WithFilter from '../WithFilter'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import Result from './Result'
import {FaArrowsAlt, FaClose} from 'react-icons/lib/fa'

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
      fullSize
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

  state = {fullSize: false}

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

  @autobind
  fullScreen() {
    this.setState({fullSize: !this.state.fullSize})
  }

  renderFullSize() {
    return this.state.fullSize ? (
      <FaClose onClick={this.fullScreen} style={{cursor: 'pointer'}} />
    ) : (
      <FaArrowsAlt onClick={this.fullScreen} style={{cursor: 'pointer'}} />
    )
  }

  @autobind
  renderButtons(indicator) {
    return <div className="row end-xs">{indicator.fullSize && this.renderFullSize()}</div>
  }

  render() {
    const {indicator} = this.props
    return (
      <div className={this.state.fullSize ? styles.fullSize : styles.container}>
        <div className={styles.header}>
          <div className="row">
            <div
              className={
                this.state.fullSize
                  ? 'col-xs-8 col-sm- col-xs-offset-2 center-xs'
                  : 'col-xs-10 col-sm-'
              }>
              <div className={styles.title}>{indicator.title}</div>
            </div>
            <div className="col-xs-2 col-sm-">{this.renderButtons(indicator)}</div>
          </div>
        </div>
        <div {...this.state.fullSize && {className: 'center'}}>
          {this.renderForCollection()}
          {this.renderWithoutCollection()}
        </div>
      </div>
    )
  }
}
