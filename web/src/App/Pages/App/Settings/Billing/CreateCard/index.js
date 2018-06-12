import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import {StripeProvider, Elements} from 'react-stripe-elements'
import getKey from 'App/helpers/stripe/getKey'
import Form from './Form'

export default class CreateCard extends React.Component {
  static propTypes = {}

  render() {
    return (
      <StripeProvider apiKey={getKey()}>
        <div className={styles.container}>
          <Section
            title="Agrega una tarjeta"
            description="Agrega una tarjeta a tu cuenta para poder comprar tickets"
            top>
            <Elements fonts={[{cssSrc: 'https://fonts.googleapis.com/css?family=Ubuntu:400,700'}]}>
              <Form />
            </Elements>
          </Section>
        </div>
      </StripeProvider>
    )
  }
}
