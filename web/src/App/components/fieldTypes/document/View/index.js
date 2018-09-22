import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Button from 'orionsoft-parts/lib/components/Button'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }

  renderNoValue() {
    return <span className={styles.noValue} />
  }

  toRef(props) {
    if (typeof props.value === 'string') {
      return window.open(props.value, '_blank', 'noopener')
    }
    window.open(
      `https://s3.amazonaws.com/${props.value.bucket}/${props.value.key}`,
      '_blank',
      'noopener'
    )
  }

  render() {
    if (!this.props.value) return this.renderNoValue()
    return (
      <div className={styles.container}>
        <Button className={styles.button} onClick={() => this.toRef(this.props)}>
          Ver Archivo
        </Button>
      </div>
    )
  }
}
