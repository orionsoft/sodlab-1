import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import PropTypes from 'prop-types'
import Button from 'orionsoft-parts/lib/components/Button'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import DeleteIcon from 'react-icons/lib/md/delete'
import IconButton from 'orionsoft-parts/lib/components/IconButton'

@withMutation(gql`
  mutation addToken($endpointId: ID) {
    addTokenToEndpoint(endpointId: $endpointId) {
      _id
      tokens
    }
  }
`)
@withMutation(gql`
  mutation deleteToken($endpointId: ID, $token: String) {
    deleteEndpointToken(endpointId: $endpointId, token: $token) {
      _id
      tokens
    }
  }
`)
@withMessage
export default class Tokens extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    endpoint: PropTypes.object,
    addToken: PropTypes.func,
    deleteToken: PropTypes.func
  }

  @autobind
  async addToken() {
    try {
      await this.props.addToken({endpointId: this.props.endpoint._id})
      this.props.showMessage('Token agregado')
    } catch (error) {
      this.props.showMessage(error)
    }
  }

  @autobind
  async delete(token) {
    try {
      await this.props.deleteToken({endpointId: this.props.endpoint._id, token})
      this.props.showMessage('Token eliminado')
    } catch (error) {
      this.props.showMessage(error)
    }
  }

  renderTokens() {
    return (this.props.endpoint.tokens || []).map(token => {
      return (
        <div key={token} className={styles.token}>
          <div className={styles.tokenContent}>{token}</div>
          <div className={styles.delete}>
            <IconButton
              onPress={() => this.delete(token)}
              icon={DeleteIcon}
              tooltip="Eliminar token"
            />
          </div>
        </div>
      )
    })
  }

  render() {
    if (!this.props.endpoint.requireToken) return null
    return (
      <div className={styles.container}>
        <Section
          title="Tokens"
          description="Genera tokens JWT para que se pueda autenticar desde el api">
          {this.renderTokens()}
          <Button onClick={this.addToken} primary>
            Crear nuevo token
          </Button>
        </Section>
      </div>
    )
  }
}
