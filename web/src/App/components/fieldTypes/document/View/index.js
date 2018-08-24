import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Button from 'orionsoft-parts/lib/components/Button'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.string
  }

  renderNoValue() {
    return <span className={styles.noValue} />
  }

  toRef(value) {
    window.open(value, '_blank')
  }

  render() {
    if (!this.props.value) return null
    return (
      <div className={styles.container}>
        <Button className={styles.button} onClick={() => this.toRef(`https://s3.amazonaws.com/${this.props.value.bucket}/${this.props.value.key}`)}>
          Ver Archivo
        </Button>
      </div>
    )
  }
}
