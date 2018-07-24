import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import isNil from 'lodash/isNil'
import NumberIncrement from 'App/components/NumberIncrement'

@withGraphQL(gql`
  query getIndicatorResult($indicatorId: ID, $filterId: ID, $filterOptions: JSON) {
    result: indicatorResult(
      indicatorId: $indicatorId
      filterId: $filterId
      filterOptions: $filterOptions
    ) {
      value
      renderType
    }
  }
`)
export default class Result extends React.Component {
  static propTypes = {
    result: PropTypes.any,
    indicator: PropTypes.object,
    setRef: PropTypes.func
  }

  constructor(props) {
    super(props)
    props.setRef(this)
  }

  renderValue(value, format) {
    return (
      <div className={styles.result}>
        <NumberIncrement value={value} format={format} />
      </div>
    )
  }

  getIndicatorType() {
    const {value, renderType} = this.props.result
    if (isNil(value)) return '-'

    if (renderType === 'percentage') {
      return this.renderValue(value, '0.[00]%')
    }
    if (renderType === 'number') {
      return this.renderValue(value, '0,0.[00]')
    }
    if (renderType === 'money') {
      return this.renderValue(value, '$0,0.[00]')
    }

    return value
  }

  render() {
    return <div className={styles.container}>{this.renderValue()}</div>
  }
}
