import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Textarea from 'orionsoft-parts/lib/components/fields/Textarea'

export default class Checkbox extends React.Component {
  static propTypes = {
    value: PropTypes.bool,
    onChange: PropTypes.func,
    errorMessage: PropTypes.string,
    disabled: PropTypes.bool
  }

  state = {}

  static getDerivedStateFromProps(props, state) {
    if (!state.prevDisabled && props.disabled) {
      props.onChange(false)
    }
    return {
      prevDisabled: props.disabled
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <Textarea {...this.props} />
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
