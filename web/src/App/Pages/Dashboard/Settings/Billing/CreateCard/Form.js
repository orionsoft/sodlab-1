import React from 'react'
import PropTypes from 'prop-types'
import {injectStripe, CardElement} from 'react-stripe-elements'
import autobind from 'autobind-decorator'
import Button from 'orionsoft-parts/lib/components/Button'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import {withRouter} from 'react-router'

@withMutation(gql`
  mutation addCard($sourceId: String) {
    addCard(sourceId: $sourceId) {
      _id
      cards {
        id
        isDefault
      }
    }
  }
`)
@withMessage
@injectStripe
@withRouter
export default class CreateCardApi extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    stripe: PropTypes.object,
    addCard: PropTypes.func
  }

  state = {}

  @autobind
  async handleSubmit(event) {
    const {source} = await this.props.stripe.createSource({type: 'card'})
    const sourceId = source.id
    try {
      await this.props.addCard({sourceId})
      this.props.showMessage('Tu tarjeta fue guardada')
      if (this.props.history.location.pathname.includes('/settings/billing')) {
        this.props.history.push('/settings/billing')
      }
    } catch (error) {
      this.props.showMessage(error)
    }
  }

  render() {
    const style = {
      iconStyle: 'solid',
      base: {
        color: '#32325d',
        lineHeight: '18px',
        border: '1px solid #111',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#aab7c4'
        },
        fontSize: '16px',
        fontFamily: 'Ubuntu, sans-serif'
      }
    }
    return (
      <form onSubmit={this.handleSubmit} ref="form">
        <div className="label">Detalles de la tarjeta</div>
        <CardElement style={style} />
        <br />
        <Button primary onClick={this.handleSubmit}>
          Guardar
        </Button>
      </form>
    )
  }
}
