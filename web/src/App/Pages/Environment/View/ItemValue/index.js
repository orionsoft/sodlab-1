import React from 'react'
import PropTypes from 'prop-types'
import fieldTypes from 'App/components/fieldTypes'

export default class ItemValue extends React.Component {
  static propTypes = {
    value: PropTypes.any,
    field: PropTypes.object
  }

  render() {
    const fieldType = fieldTypes[this.props.field.type]
    if (!fieldType) return 'Error: FT not found'
    const ViewComponent = fieldType.view
    if (!ViewComponent) return this.props.value || ''

    return <ViewComponent value={this.props.value} options={this.props.field.options} />
  }
}
