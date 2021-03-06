import React from 'react'
import PropTypes from 'prop-types'
import {Field} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import iconOptions from 'App/components/Icon/options'
import RouteIconButton from './RouteIconButton'
import DeleteDocument from './DeleteDocument'
import RunHooks from './RunHooks'
import PostItem from './PostItem'
import MultipleSelect from './MultipleSelect'

export default class FieldOptions extends React.Component {
  static propTypes = {
    field: PropTypes.object,
    collection: PropTypes.object
  }

  renderTypeField() {
    const options = [{label: 'ID', value: '_id'}, ...this.props.collection.fields]
    return (
      <div className="col-xs-12 col-sm-12 col-md-8">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6">
            <div className="label">Etiqueta</div>
            <Field fieldName="label" type={Text} />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6">
            <div className="label">Campo</div>
            <Field fieldName="fieldName" type={Select} options={options} />
          </div>
        </div>
      </div>
    )
  }

  renderTypeSelectIconButton() {
    const fromOptions = [{label: 'ID', value: '_id'}, ...this.props.collection.fields]
    return [
      <div key={1} className="col-xs-12 col-sm-6 col-md-8">
        <div className="label">Icono</div>
        <Field fieldName="options.icon" type={Select} options={iconOptions} />
      </div>,
      <div key={2} className="col-xs-12" style={{marginTop: 5}}>
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <div className="label">Variable</div>
            <Field fieldName="options.variableFrom" type={Select} options={fromOptions} />
            <div className="description">La valor de esta variable se entregará a la vista</div>
          </div>
          <div className="col-xs-12 col-sm-6">
            <div className="label">Nombre</div>
            <Field fieldName="options.variableTo" type={Text} />
            <div className="description">Nombre del parametro</div>
          </div>
        </div>
        <div className="label">Tooltip</div>
        <Field fieldName="options.tooltip" type={Text} />
      </div>
    ]
  }

  renderTypeRouteIconButton() {
    return <RouteIconButton {...this.props} />
  }

  renderDeleteOption() {
    return <DeleteDocument {...this.props} />
  }

  renderRunHooks() {
    return <RunHooks {...this.props} />
  }

  renderPostItem() {
    return <PostItem {...this.props} />
  }

  renderMultipleSelect() {
    return <MultipleSelect {...this.props} />
  }

  render() {
    const {field} = this.props
    if (!field.type) return null
    if (field.type === 'field') return this.renderTypeField()
    if (field.type === 'selectIconButton') return this.renderTypeSelectIconButton()
    if (field.type === 'routeIconButton') return this.renderTypeRouteIconButton()
    if (field.type === 'deleteRowByUser') return this.renderDeleteOption()
    if (field.type === 'runHooks') return this.renderRunHooks()
    if (field.type === 'postItem') return this.renderPostItem()
    if (field.type === 'multipleSelect') return this.renderMultipleSelect()

    return 'undefined type'
  }
}
