import React from 'react'
import styles from './styles.css'
import {SketchPicker} from 'react-color'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import Button from 'orionsoft-parts/lib/components/Button'

export default class ColorPicker extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
    defaultColor: PropTypes.string
  }

  static defaultProps = {
    defaultColor: '#fff'
  }

  state = {
    display: false
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.value) {
      return {
        background: '#fff'
      }
    }
    if (props.value && !state.value) {
      return {
        background: props.value
      }
    }
  }

  @autobind
  handleClick() {
    this.setState({display: !this.state.display})
  }

  @autobind
  handleClose() {
    this.setState({display: false})
  }

  @autobind
  handleChangeComplete(color) {
    this.props.onChange(color.hex)
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.inline}>
          <div className={styles.testContainer} onClick={this.handleClick}>
            <div className={styles.test} style={{background: this.state.background}} />
          </div>
          <Button
            style={{
              height: '24px',
              marginLeft: '26px',
              fontSize: '10px',
              padding: '0 8px'
            }}
            onClick={() => this.props.onChange(this.props.defaultColor)}>
            Por defecto
          </Button>
        </div>
        {this.state.display ? (
          <div className={styles.popSketch}>
            <div className={styles.cover} onClick={this.handleClose} />
            <SketchPicker
              color={this.state.background}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
        ) : null}
      </div>
    )
  }
}
