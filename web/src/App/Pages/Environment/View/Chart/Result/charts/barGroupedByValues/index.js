import React from 'react'
import styles from './styles.css'
import {
  XAxis,
  YAxis,
  VerticalBarSeries,
  Hint,
  FlexibleXYPlot,
  DiscreteColorLegend,
  LineSeries,
  MarkSeries,
  LineMarkSeries
} from 'react-vis'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import 'Root/node_modules/react-vis/dist/style.css'

export default class BarGroupByValues extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    width: PropTypes.number,
    renderHint: PropTypes.func
  }

  state = {width: null, value: false}

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

  @autobind
  onNearestX(value) {
    this.setState({value})
  }

  renderLegend() {
    const {titles} = this.props.data
    const items = titles.map((title, index) => ({title: title.title || `Serie ${index + 1}`}))
    return <DiscreteColorLegend items={items} orientation="horizontal" />
  }

  renderHint(label) {
    const {value} = this.state
    if (!value) return
    const yAxisLabel = label ? `${label}: ${value.y}` : `${value.y}`
    return (
      <Hint value={value}>
        <div className={styles.hint}>
          <div className={styles.hintLabel}>{value.x}</div>
          <div className={styles.hintValue}>{yAxisLabel}</div>
        </div>
      </Hint>
    )
  }

  renderSeries(datasets, charts) {
    const datasetNames = Object.keys(datasets)
    const barWidth = 1 / datasetNames.length
    return datasetNames.map((dataset, index) => {
      if (charts[index] === '$bar') {
        return (
          <VerticalBarSeries
            key={dataset}
            barWidth={barWidth}
            data={datasets[dataset]}
            onValueMouseOver={this.onNearestX}
            onSeriesMouseOut={() => this.setState({value: null})}
          />
        )
      } else if (charts[index] === '$line') {
        return (
          <LineSeries
            key={dataset}
            data={datasets[dataset]}
            onValueMouseOver={this.onNearestX}
            onSeriesMouseOut={() => this.setState({value: null})}
          />
        )
      } else if (charts[index] === '$dot') {
        return (
          <MarkSeries
            key={dataset}
            data={datasets[dataset]}
            onValueMouseOver={this.onNearestX}
            onSeriesMouseOut={() => this.setState({value: null})}
          />
        )
      } else if (charts[index] === '$curvedLine') {
        return (
          <LineMarkSeries
            key={dataset}
            data={datasets[dataset]}
            curve={'curveMonotoneX'}
            onValueMouseOver={this.onNearestX}
            onSeriesMouseOut={() => this.setState({value: null})}
          />
        )
      } else {
        return (
          <VerticalBarSeries
            key={dataset}
            barWidth={barWidth}
            data={datasets[dataset]}
            onValueMouseOver={this.onNearestX}
            onSeriesMouseOut={() => this.setState({value: null})}
          />
        )
      }
    })
  }

  renderCharts() {
    if (!this.state.width) return

    const {
      datasets,
      charts,
      xLabelAngle,
      yLabelAngle,
      xAxisTitle,
      yAxisTitle,
      hintValueText,
      margins
    } = this.props.data
    const verticalBarSeries = this.renderSeries(datasets, charts)
    const children = [
      <XAxis key="xAxis" tickLabelAngle={xLabelAngle} title={xAxisTitle || ''} position="end" />,
      <YAxis key="yAxis" title={yAxisTitle || ''} tickLabelAngle={yLabelAngle} />,
      ...verticalBarSeries,
      this.renderHint(hintValueText),
      this.renderLegend()
    ]
    return <FlexibleXYPlot xType="ordinal" height={300} children={children} margin={margins} />
  }

  render() {
    return (
      <div className={styles.container} ref="container">
        {this.renderCharts()}
      </div>
    )
  }
}
