import React from 'react'
import styles from './styles.css'
import {
  Hint,
  FlexibleXYPlot,
  DiscreteColorLegend,
  ContinuousColorLegend,
  ArcSeries
} from 'react-vis'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import 'Root/node_modules/react-vis/dist/style.css'

export default class PieGroupByValues extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    width: PropTypes.number,
    renderHint: PropTypes.func
  }

  state = {datapoint: false}

  @autobind
  onValueMouseOver(datapoint, event) {
    this.setState({datapoint})
  }

  renderLegend() {
    const width = document.getElementById('root').clientWidth
    const orientation = width < 600 ? 'horizontal' : 'vertical'
    if (this.props.data.legend.use === 'discrete') {
      return (
        <DiscreteColorLegend
          items={this.props.data.legend.discrete.items}
          orientation={orientation}
        />
      )
    }
    return (
      <ContinuousColorLegend
        startTitle="01"
        midTitle="04"
        endTitle="06"
        startColor="rgb(85, 88, 218)"
        endColor="rgb(95, 209, 249)"
      />
    )
  }

  renderHint() {
    const {datapoint} = this.state
    if (!datapoint) return
    const {label, value} = datapoint
    const {startHintText, endHintText} = this.props.data
    let modifiedValue = startHintText ? startHintText + ' ' + value : value
    modifiedValue = endHintText ? modifiedValue + ' ' + endHintText : modifiedValue
    return (
      <Hint value={value} style={{display: 'flex', minWidth: '15%'}}>
        <div className={styles.hint}>
          <div className={styles.hintLabel}>{label}</div>
          <div className={styles.hintValue}>{modifiedValue}</div>
        </div>
      </Hint>
    )
  }

  render() {
    return (
      <div className={styles.container} ref="container">
        <FlexibleXYPlot xDomain={[-15, 15]} yDomain={[-15, 15]} className={styles.plot}>
          <ArcSeries
            center={{x: -3, y: -3}}
            data={this.props.data.dataset}
            colorDomain={this.props.data.colorDomain}
            colorRange={this.props.data.colorRange}
            colorType={this.props.data.colorType}
            onValueMouseOver={this.onValueMouseOver}
            onSeriesMouseOut={() => this.setState({datapoint: false})}
          />
          {this.renderHint()}
          {this.renderLegend()}
        </FlexibleXYPlot>
      </div>
    )
  }
}
