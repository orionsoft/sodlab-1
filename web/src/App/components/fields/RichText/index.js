import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import RichTextEditor from 'react-rte'
import autobind from 'autobind-decorator'

export default class RichText extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string
  }

  @autobind
  onChange(value) {
    this.props.onChange(value)
  }

  render() {
    return (
      <div className={styles.container}>
        <RichTextEditor value={this.state.value} onChange={value => this.onChange} />
      </div>
    )
  }
}
