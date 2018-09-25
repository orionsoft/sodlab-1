import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import charts from './charts'

@withGraphQL(gql`
  query getChartResult($chartId: ID, $params: JSON) {
    result: chartResult(chartId: $chartId, params: $params)
  }
`)
export default class Result extends React.Component {
  static propTypes = {
    setRef: PropTypes.func,
    result: PropTypes.object,
    chart: PropTypes.object
  }

  constructor(props) {
    super(props)
    props.setRef(this)
  }

  render() {
    const {chart} = this.props
    const Component = charts[chart.chartTypeId]
    if (!Component) return `Chart type ${chart.chartTypeId} not found`
    console.log(this.props)
    return <Component data={this.props.result} chart={chart} />
  }
}
