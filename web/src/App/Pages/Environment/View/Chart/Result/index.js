import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import charts from './charts'

@withGraphQL(gql`
  query getChartResult($chartId: ID, $filterId: ID, $filterOptions: JSON, $params: JSON) {
    result: chartResult(
      chartId: $chartId
      filterId: $filterId
      filterOptions: $filterOptions
      params: $params
    )
  }
`)
export default class Result extends React.Component {
  static propTypes = {
    setRef: PropTypes.func,
    result: PropTypes.object
  }

  constructor(props) {
    super(props)
    props.setRef(this)
  }

  render() {
    const {renderType} = this.props.result
    const Component = charts[renderType]
    if (!Component) return `Chart type ${renderType} not found`
    return <Component data={this.props.result} />
  }
}
