import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import NumberFormat from 'react-number-format'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.string
  }

  render() {
    const {value} = this.props
    if (!value) return null
    return (
      <div className={styles.container}>
        <NumberFormat
          value={parseInt(this.props.value, 10)}
          displayType={'text'}
          format="(+56#) #### ####"
          renderText={value => <div>{value}</div>}
        />
      </div>
    )
  }
}
