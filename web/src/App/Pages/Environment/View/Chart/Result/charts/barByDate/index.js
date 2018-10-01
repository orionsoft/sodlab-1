import React from 'react'
import styles from './styles.css'
import {XYPlot, XAxis, YAxis, VerticalBarSeries, Hint} from 'react-vis'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import moment from 'moment'

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

  componentDidUpdate(prevProps, prevState) {
    const width = this.refs.container.clientWidth
    if (this.state.width !== width) {
      this.setState({width})
    }
  }

  getShortDateFormat() {
    const map = {
      year: 'YYYY',
      month: 'MM/YYYY',
      day: 'D/MM',
      hour: 'HH:mm'
    }
    return map[this.props.data.divideBy]
  }

  getLongDateFormat() {
    const map = {
      year: 'YYYY',
      month: 'MMMM, YYYY',
      day: 'LL',
      hour: 'LLL'
    }
    return map[this.props.data.divideBy]
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
          <div className={styles.hintLabel}>{moment(value.x).format(this.getLongDateFormat())}</div>
          <div className={styles.hintValue}>Total: {value.y}</div>
        </div>
      </Hint>
    )
  }

  renderChart() {
    if (!this.state.width) return
    return (
      <XYPlot xType="ordinal" width={this.state.width} height={300}>
        <XAxis tickFormat={v => moment(v).format(this.getShortDateFormat())} />
        <YAxis />
        <VerticalBarSeries
          onValueMouseOver={this.onNearestX}
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
