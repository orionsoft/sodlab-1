import React from 'react'
import PropTypes from 'prop-types'
import RichTextEditor from 'react-rte'
import autobind from 'autobind-decorator'

export default class RichText extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    errorMessage: PropTypes.string
  }

  state = {}

  static getDerivedStateFromProps(props, state) {
    if (!props.value) {
      return {
        value: RichTextEditor.createEmptyValue()
      }
    }
    if (
      (props.value && !state.value) ||
      props.value.toString('html') !== state.value.toString('html')
    ) {
      return {
        value: RichTextEditor.createValueFromString(props.value, 'html')
      }
    }
  }

  @autobind
  onChange(value) {
    this.setState({value})
    this.props.onChange(value.toString('html'))
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <div className="os-input-container">
          <RichTextEditor value={this.state.value} onChange={this.onChange} />
        </div>
        <div className="error">{this.props.errorMessage}</div>
      </div>
    )
  }
}
