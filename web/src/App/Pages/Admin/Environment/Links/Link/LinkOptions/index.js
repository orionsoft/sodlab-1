import React from 'react'
import PropTypes from 'prop-types'
import {Field, WithValue} from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import range from 'lodash/range'
import iconOptions from 'App/components/Icon/options'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'
import Select from 'orionsoft-parts/lib/components/fields/Select'

export default class LinkOptions extends React.Component {
  static propTypes = {
    link: PropTypes.object
  }

  getSizeOptions() {
    return range(12).map(index => ({label: `${12 - index}/12`, value: String(12 - index)}))
  }

  renderCardOptions(field) {
    if (!field.showInHome) return null
    return (
      <div>
        <div className="label">Tamaño Tarjeta</div>
        <div className="row">
          <div className="col-xs-12 col-sm-4">
            <div className="label">Columnas Móvil</div>
            <Field fieldName="sizeSmall" type={Select} options={this.getSizeOptions()} />
          </div>
          <div className="col-xs-12 col-sm-4">
            <div className="label">Columnas Mediano</div>
            <Field fieldName="sizeMedium" type={Select} options={this.getSizeOptions()} />
          </div>
          <div className="col-xs-12 col-sm-4">
            <div className="label">Columnas Largo</div>
            <Field fieldName="sizeLarge" type={Select} options={this.getSizeOptions()} />
          </div>
        </div>
      </div>
    )
  }

  renderCategory() {
    return (
      <Field fieldName="fields" type={ArrayComponent}>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6">
            <div className="label">Título</div>
            <Field fieldName="title" type={Text} />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6">
            <div className="label">Ruta</div>
            <Field fieldName="path" type={Text} />
          </div>
          <div className="divider" />
          <div className="col-xs-12 col-sm-12 col-md-6">
            <div className="label">Icono</div>
            <Field fieldName="icon" type={Select} options={iconOptions} />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6">
            <div className="label">Mostrar en home</div>
            <Field fieldName="showInHome" type={Checkbox} label="Mostrar en home" />
          </div>
        </div>
        <WithValue>{field => this.renderCardOptions(field)}</WithValue>
      </Field>
    )
  }

  renderPath() {
    return (
      <div>
        <div className="label">Ruta</div>
        <Field fieldName="path" type={Text} />
      </div>
    )
  }

  render() {
    const {link} = this.props
    if (!link.type) return null
    if (link.type === 'path') return this.renderPath()
    if (link.type === 'category') return this.renderCategory()
    return 'undefined type'
  }
}
