import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import visa from 'payment-icons/svg/flat/visa.svg'
import mastercard from 'payment-icons/svg/flat/mastercard.svg'
import diners from 'payment-icons/svg/flat/diners.svg'
import amex from 'payment-icons/svg/flat/amex.svg'
import discover from 'payment-icons/svg/flat/discover.svg'
import jcb from 'payment-icons/svg/flat/jcb.svg'
import defaultCard from 'payment-icons/svg/flat/default.svg'

const cardBrandToPfClass = {
  visa,
  mastercard,
  amex,
  discover,
  diners,
  jcb,
  defaultCard
}

export default class CardIcon extends React.Component {
  static propTypes = {
    brand: PropTypes.string
  }

  getIcon() {
    const brand = this.props.brand || ''
    const className = cardBrandToPfClass[brand.toLowerCase()]
    if (!className) return cardBrandToPfClass.defaultCard
    return className
  }

  render() {
    return (
      <span className={styles.container}>
        <img src={this.getIcon()} alt={this.props.brand} />
      </span>
    )
  }
}
