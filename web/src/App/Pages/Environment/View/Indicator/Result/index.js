import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

@withGraphQL(gql`
  query getIndicatorResult($indicatorId: ID, $filterId: ID, $filterOptions: JSON) {
    result: indicatorResult(
      indicatorId: $indicatorId
      filterId: $filterId
      filterOptions: $filterOptions
    )
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

  render() {
    return <div className={styles.container}>{this.props.result}</div>
  }
}
