import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import isNil from 'lodash/isNil'
import NumberIncrement from 'App/components/NumberIncrement'

@withGraphQL(gql`
  query getIndicatorResult($indicatorId: ID, $filterId: ID, $filterOptions: JSON, $params: JSON) {
    result: indicatorResult(
      indicatorId: $indicatorId
      filterId: $filterId
      filterOptions: $filterOptions
      params: $params
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
    setRef: PropTypes.func,
    fullSize: PropTypes.bool
  }

  constructor(props) {
    super(props)
    props.setRef(this)
  }

  renderValue(node) {
    const {fullSize} = this.props
    return <div className={fullSize ? styles.fullSizeResult : styles.result}>{node}</div>
  }

  renderNumberValue(value, format) {
    const {fullSize} = this.props
    return (
      <div className={fullSize ? styles.fullSizeResult : styles.result}>
        {this.renderValue(<NumberIncrement value={value} format={format} />)}
      </div>
    )
  }

  getIndicatorType() {
    const {value, renderType} = this.props.result
    if (isNil(value)) return '-'

    if (renderType === 'percentage') {
      return this.renderNumberValue(value, '0.[00]%')
    }
    if (renderType === 'number') {
      return this.renderNumberValue(value, '0,0.[00]')
    }
    if (renderType === 'money') {
      return this.renderNumberValue(value, '$0,0.[00]')
    }
    if (renderType === 'boolean') {
      return this.renderValue(value ? 'Verdadero' : 'Falso')
    }

    return this.renderValue(value)
  }

  render() {
    return <div className={styles.container}>{this.getIndicatorType()}</div>
  }
}
