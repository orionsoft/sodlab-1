import React from 'react'
import PropTypes from 'prop-types'
import ItemValue from '../../ItemValue'
import IconButton from 'orionsoft-parts/lib/components/IconButton'
import icons from 'App/components/Icon/icons'
import {withRouter} from 'react-router'
import MutationButton from 'App/components/MutationButton'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import styles from './styles.css'
import autobind from 'autobind-decorator'

@withMessage
@withRouter
export default class Field extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    field: PropTypes.object,
    collectionField: PropTypes.object,
    doc: PropTypes.object,
    setEnvironment: PropTypes.func,
    state: PropTypes.object,
    table: PropTypes.object,
    collectionId: PropTypes.string,
    parameters: PropTypes.object,
    fieldIndex: PropTypes.number
  }

  state = {}

  @autobind
  async sendPostItem({url, data}) {
    this.setState({sendingPostItem: true})
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const content = await response.text()
      console.log('Item sent, response:', content)
      this.props.showMessage('Enviado correctamente')
    } catch (error) {
      this.props.showMessage(error)
    }
    this.setState({sendingPostItem: false})
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
    const key = field.options.variableTo
    const selected = this.props.parameters[key] === value
    const className = selected ? styles.selectedIcon : null
    const onClick = () =>
      this.props.setEnvironment({
        [key]: selected ? null : value
      })
    const icon = icons[field.options.icon]
    return (
      <span className={className}>
        <IconButton onPress={onClick} icon={icon} tooltip={field.options.tooltip} size={18} />
      </span>
    )
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
    const selected = path === this.props.location.pathname
    const className = selected ? styles.selectedIcon : null
    return (
      <span className={className}>
        <IconButton onPress={onClick} icon={icon} tooltip={field.options.tooltip} size={18} />
      </span>
    )
  }

  renderDeleteDocumentByUser() {
    const {table, doc, field, fieldIndex} = this.props
    const icon = icons[field.options.icon]
    const itemId = doc._id
    return (
      <MutationButton
        label="Eliminar"
        title="¿Quieres eliminar este documento?"
        confirmText="Confirmar"
        mutation="tableDeleteItem"
        onSuccess={() => this.props.showMessage('Elemento eliminado satisfactoriamente!')}
        params={{tableId: table._id, itemId, fieldIndex}}>
        <IconButton icon={icon} tooltip={field.options.tooltip} size={18} />
      </MutationButton>
    )
  }

  renderRunHooks() {
    const {table, doc, field, fieldIndex} = this.props
    const icon = icons[field.options.icon]
    const itemId = doc._id
    return (
      <MutationButton
        title={field.options.tooltip}
        confirmText="Confirmar"
        mutation="tableRunHooks"
        onSuccess={() => this.props.showMessage('Se ha ejecutado correctamente')}
        params={{tableId: table._id, itemId, fieldIndex}}>
        <IconButton icon={icon} tooltip={field.options.tooltip} size={18} />
      </MutationButton>
    )
  }

  renderPostItem() {
    const {doc, field} = this.props
    const icon = icons[field.options.icon]
    const data = {
      _id: doc._id,
      ...doc.data
    }
    const url = field.options.url
    return (
      <IconButton
        icon={icon}
        onPress={() => this.sendPostItem({url, data})}
        tooltip={field.options.tooltip}
        disabled={this.state.sendingPostItem}
        size={18}
      />
    )
  }

  render() {
    const {field} = this.props
    if (!field.type) return null
    if (field.type === 'field') return this.renderTypeField()
    if (field.type === 'selectIconButton') return this.renderTypeSelectIconButton()
    if (field.type === 'routeIconButton') return this.renderTypeRouteIconButton()
    if (field.type === 'deleteRowByUser') return this.renderDeleteDocumentByUser()
    if (field.type === 'runHooks') return this.renderRunHooks()
    if (field.type === 'postItem') return this.renderPostItem()

    return 'undefined type ' + field.type
  }
}
