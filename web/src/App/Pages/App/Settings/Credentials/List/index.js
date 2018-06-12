import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

@withGraphQL(gql`
  query getMyCredentials {
    credentials {
      _id
      name
    }
  }
`)
export default class List extends React.Component {
  static propTypes = {
    credentials: PropTypes.object
  }

  renderCredentials() {
    return this.props.credentials.map(credential => {
      return <div key={credential._id}>{credential.name}</div>
    })
  }

  render() {
    return (
      <div className={styles.container}>
        <Section title="Credentials" description="Your AWS access keys" top>
          {this.renderCredentials()}
          <br />
          <div>
            <Button to="/settings/credentials/add">Add a new credential</Button>
          </div>
        </Section>
      </div>
    )
  }
}
