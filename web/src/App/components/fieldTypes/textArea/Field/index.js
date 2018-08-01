import React from 'react'
import styles from './styles.css'
import TextArea from 'App/components/fields/TextArea'
import PropTypes from 'prop-types'

export default class Field extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    passProps: PropTypes.object
  }

  render() {
    const {
      passProps: {minHeight},
      ...rest
    } = this.props
    return (
      <div className={styles.container}>
        <TextArea rows={minHeight} {...rest} />
      </div>
    )
  }
}
