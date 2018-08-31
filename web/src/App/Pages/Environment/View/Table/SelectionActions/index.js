import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Button from './Button'

export default class SelectionActions extends React.Component {
  static propTypes = {
    field: PropTypes.object,
    items: PropTypes.array
  }

  renderButtons() {
    return this.props.field.options.buttonsIds.map(buttonId => {
      return <Button key={buttonId} buttonId={buttonId} items={this.props.items} />
    })
  }

  render() {
    return <div className={styles.container}>{this.renderButtons()}</div>
  }
}
