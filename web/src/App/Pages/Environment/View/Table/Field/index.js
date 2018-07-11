import React from 'react'
import PropTypes from 'prop-types'
import ItemValue from '../../ItemValue'
import IconButton from 'orionsoft-parts/lib/components/IconButton'
import icons from 'App/components/Icon/icons'
import {withRouter} from 'react-router'

@withRouter
export default class Field extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    field: PropTypes.object,
    collectionField: PropTypes.object,
    doc: PropTypes.object,
    setEnvironment: PropTypes.func,
    state: PropTypes.object,
    table: PropTypes.object
  }

  renderTypeField() {
    const {doc, field, collectionField} = this.props
    return (
      <ItemValue
        value={doc.data[field.fieldName]}
        field={collectionField}
        tableField={field}
        table={this.props.table}
      />
    )
  }

  renderTypeSelectIconButton() {
    const {doc, field} = this.props
    const varName = field.options.variableFrom
    const value = varName === '_id' ? doc._id : doc.data[varName]
    const onClick = () =>
      this.props.setEnvironment({
        [field.options.variableTo]: value
      })
    const icon = icons[field.options.icon]
    return <IconButton onPress={onClick} icon={icon} tooltip={field.options.tooltip} size={18} />
  }

  renderTypeRouteIconButton() {
    const {doc, field} = this.props
    const rawPath = field.options.viewPath
    const vars = field.options.variableMap || {}
    let path = rawPath
    for (const key of Object.keys(vars)) {
      const varName = vars[key]
      const value = varName === '_id' ? doc._id : doc.data[varName]
      path = path.replace(`:${key}`, value)
    }
    const onClick = () => this.props.history.push(path)
    const icon = icons[field.options.icon]
    return <IconButton onPress={onClick} icon={icon} tooltip={field.options.tooltip} size={18} />
  }

  render() {
    const {field} = this.props
    if (!field.type) return null
    if (field.type === 'field') return this.renderTypeField()
    if (field.type === 'selectIconButton') return this.renderTypeSelectIconButton()
    if (field.type === 'routeIconButton') return this.renderTypeRouteIconButton()

    return 'undefined type ' + field.type
  }
}
