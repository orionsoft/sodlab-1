import React from 'react'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'
import PropTypes from 'prop-types'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.object
  }

  renderNoValue() {
    return <span className={styles.noValue} />
  }

  toRef(bucket, key) {
    window.open(`https://s3.amazonaws.com/${bucket}/${key}`, '_blank')
  }

  render() {
    if (!this.props.value || !this.props.value.name) return this.renderNoValue()
    return (
      <div className={styles.container}>
        <Button onClick={() => this.toRef(this.props.value.bucket, this.props.value.key)}>
          {this.props.value.name}
        </Button>
      </div>
    )
  }
}
