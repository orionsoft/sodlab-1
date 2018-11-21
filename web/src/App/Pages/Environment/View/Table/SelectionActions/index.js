import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Button from './Button'

export default class SelectionActions extends React.Component {
  static propTypes = {
    field: PropTypes.object,
    items: PropTypes.object,
    all: PropTypes.bool,
    params: PropTypes.object,
    toggleAllItems: PropTypes.func
  }

  renderButtons() {
    return this.props.field.options.buttonsIds.map(buttonId => {
      return (
        <Button
          key={buttonId}
          buttonId={buttonId}
          items={this.props.items}
          all={this.props.all}
          params={this.props.params}
          toggleAllItems={this.props.toggleAllItems}
        />
      )
    })
  }

  render() {
    return <div className={styles.container}>{this.renderButtons()}</div>
  }
}
