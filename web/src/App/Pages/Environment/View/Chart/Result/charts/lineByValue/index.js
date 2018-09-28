import React from 'react'
import styles from './styles.css'
import {XYPlot, XAxis, YAxis, LineSeries, Hint} from 'react-vis'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

export default class BarCountByDate extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    width: PropTypes.number,
    renderHint: PropTypes.func
  }

  state = {value: false}

  componentDidMount() {
    const width = this.refs.container.clientWidth
    this.setState({width})
  }

  @autobind
  onNearestX(value) {
    this.setState({value})
  }

  renderHint() {
    const {value} = this.state
    if (!value) return
    return (
      <Hint value={value}>
        <div className={styles.hint}>
          <div className={styles.hintLabel}>{value.x}</div>
          <div className={styles.hintValue}>Total: {value.y}</div>
        </div>
      </Hint>
    )
  }

  renderChart() {
    if (!this.state.width) return
    return (
      <XYPlot xType="ordinal" width={this.state.width} height={300}>
        <XAxis tickFormat={v => `${v} - ${parseInt(v) + this.props.data.divideBy}`} />
        <YAxis />
        <LineSeries
          onNearestX={this.onNearestX}
          onSeriesMouseOut={() => this.setState({value: null})}
          data={this.props.data.points}
        />
        {this.renderHint()}
      </XYPlot>
    )
  }

  render() {
    return (
      <div className={styles.container} ref="container">
        {this.renderChart()}
      </div>
    )
  }
}
