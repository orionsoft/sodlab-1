import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

@withGraphQL(gql`
  query getChartResult($chartId: ID, $params: JSON) {
    result: chartResult(chartId: $chartId, params: $params)
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
    console.log(this.props)
    return <div className={styles.container}>Result</div>
  }
}
