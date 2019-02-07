import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import isNil from 'lodash/isNil'
import NumberIncrement from 'App/components/NumberIncrement'
import moment from 'moment-timezone/builds/moment-timezone-with-data'

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
      renderFormat
    }
  }
`)
export default class Result extends React.Component {
  static propTypes = {
    result: PropTypes.any,
    indicator: PropTypes.object,
    setRef: PropTypes.func,
    fullSize: PropTypes.bool,
    timezone: PropTypes.string
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

  renderDate(value) {
    const {fullSize} = this.props
    const renderFormat = this.props.result.renderFormat
      ? this.props.result.renderFormat
      : 'MM/DD/YYYY'
    const date = moment(value)
      .tz(this.props.timezone)
      .format(renderFormat)
    return <div className={fullSize ? styles.fullSizeResult : styles.result}>{date}</div>
  }

  renderDatetime(value) {
    const {fullSize} = this.props
    const renderFormat = this.props.result.renderFormat
      ? this.props.result.renderFormat
      : 'MM/DD/YYYY kk:mm'
    const date = moment(value)
      .tz(this.props.timezone)
      .format(renderFormat)
    return <div className={fullSize ? styles.fullSizeResult : styles.result}>{date}</div>
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
    if (renderType === 'money' || renderType === 'currency') {
      return this.renderNumberValue(value, '$0,0.[00]')
    }
    if (renderType === 'boolean') {
      return this.renderValue(value ? 'Verdadero' : 'Falso')
    }
    if (renderType === 'date') {
      return this.renderDate(value)
    }
    if (renderType === 'datetime') {
      return this.renderDatetime(value)
    }

    return this.renderValue(value)
  }

  render() {
    return <div className={styles.container}>{this.getIndicatorType()}</div>
  }
}
