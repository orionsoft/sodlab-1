import React from 'react'
import styles from './styles.css'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

@withEnvironmentId
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
      fontName
    }
  }
`)
export default class Styles extends React.Component {
  static propTypes = {
    environment: PropTypes.object
  }

  render() {
    const {fontName} = this.props.environment
    let font = fontName ? fontName.replace(/ /, '+') : 'Ubuntu'
    return (
      <div className={styles.container}>
        <style jsx="true">{`
          @import url('https://fonts.googleapis.com/css?family=${font}:400,600');

          body {
            font-family: '${fontName || 'Ubuntu'}', sans-serif;
          }
        `}</style>
      </div>
    )
  }
}
