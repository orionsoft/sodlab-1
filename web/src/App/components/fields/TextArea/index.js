import React from 'react'
import autobind from 'autobind-decorator'
import getHeight from './getHeight'
import PropTypes from 'prop-types'

export default class Textarea extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    fieldType: PropTypes.string,
    passProps: PropTypes.object,
    placeholder: PropTypes.node,
    errorMessage: PropTypes.node,
    rows: PropTypes.number,
    autoResize: PropTypes.bool
  }

  static defaultProps = {
    autoResize: true
  }

  static getDerivedStateFromProps(props, state) {
    return {
      value: props.value || ''
    }
  }

  state = {value: ''}

  @autobind
  autoResize(event) {
    if (!this.props.autoResize) return
    const {height} = getHeight(this.refs.input)
    if (this.state.height !== height) {
      this.setState({height})
    }
  }

  @autobind
  onChange(event) {
    this.props.onChange(event.target.value)
    this.autoResize(event)
  }

  render() {
    return (
      <div>
        <div className="os-input-container">
          <textarea
            ref="input"
            className="os-input-text"
            rows={this.props.rows || 2}
            value={this.state.value}
            placeholder={this.props.placeholder}
            onChange={this.onChange}
            {...this.props.passProps}
          />
        </div>
        <div className="os-input-error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
