import React from 'react'
import styles from './styles.css'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Container from 'orionsoft-parts/lib/components/Container'
import Card from './Card'

@withEnvironmentId
@withGraphQL(gql`
  query getLinks($environmentId: ID) {
    cards(environmentId: $environmentId)
  }
`)
export default class Home extends React.Component {
  static propTypes = {
    cards: PropTypes.array
  }

  renderItems(items) {
    if (!items) return null
    const links = items.map((item, index) => {
      return (
        <div
          key={index}
          className={`col-xs-${item.sizeSmall} col-sm-${item.sizeMedium} col-md-${item.sizeLarge}`}>
          <Card link={item} />
        </div>
      )
    })
    return <div className="row">{links}</div>
  }

  render() {
    const {cards} = this.props
    return (
      <Container>
        <div className={styles.container}>
          <div className={styles.cardsContainer}>{this.renderItems(cards)}</div>
        </div>
      </Container>
    )
  }
}
