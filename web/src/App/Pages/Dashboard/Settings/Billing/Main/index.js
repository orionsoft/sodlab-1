import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import CreateCard from '../CreateCard'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import CardIcon from '../CardIcon'
import CardActions from './CardActions'

@withGraphQL(gql`
  query getMyCards {
    me {
      _id
      cards {
        id
        brand
        last4
        isDefault
      }
    }
  }
`)
export default class Main extends React.Component {
  static propTypes = {
    me: PropTypes.object
  }

  renderNoCards() {
    return <CreateCard />
  }

  renderCards() {
    return this.props.me.cards.map((card, index) => {
      return (
        <div className={styles.card} key={index}>
          <div>
            <CardIcon brand={card.brand} />
          </div>
          <div className={styles.last4}>**** {card.last4}</div>
          <CardActions card={card} />
        </div>
      )
    })
  }

  render() {
    if (!this.props.me) return null
    if (!this.props.me.cards.length) return this.renderNoCards()
    return (
      <div className={styles.container}>
        <Section
          title="Mis métodos de pago"
          description="Cuando tienes tu tarjeta guardada puedes realizar compras de tickets"
          top>
          {this.renderCards()}
          <br />
          <div>
            <Button to="/settings/billing/create">Agregar tarjeta</Button>
          </div>
        </Section>
      </div>
    )
  }
}
