import React from 'react'
import formatNumber from '../formatNumber'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'

export default class Component extends React.Component {
  static propTypes = {
    limit: PropTypes.number,
    setLimit: PropTypes.func,
    result: PropTypes.object,
    defaultLimit: PropTypes.number
  }

  @autobind
  onChange(event) {
    this.props.setLimit(Number(event.target.value))
  }

  renderOptions() {
    const {limit, defaultLimit} = this.props
    let options = [10, 25, 50, 100, 200]
    if (limit && !options.includes(defaultLimit)) {
      options = [...options, ...[defaultLimit]]
    }
    return options.sort((a, b) => a - b).map(elem => {
      return <option value={elem}>{elem}</option>
    })
  }

  renderSelect() {
    return (
      <select
        className="paginated-pagination-select"
        value={this.props.limit}
        onChange={this.onChange}>
        {this.renderOptions()}
      </select>
    )
  }

  render() {
    return (
      <div>
        Show {this.renderSelect()} of {formatNumber(this.props.result.totalCount)}
      </div>
    )
  }
}
