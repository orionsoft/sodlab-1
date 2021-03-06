import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import PropTypes from 'prop-types'
import AutoForm from 'App/components/AutoForm'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import ObjectField from 'App/components/fields/ObjectField'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'
import {Field} from 'simple-react-form'
import autobind from 'autobind-decorator'
import cloneDeep from 'lodash/cloneDeep'
import translate from 'App/i18n/translate'
import range from 'lodash/range'
import clone from 'lodash/clone'
import ColorPicker from 'App/components/fields/ColorPicker'

@withGraphQL(gql`
  query getForm($viewId: ID, $environmentId: ID) {
    view(viewId: $viewId) {
      _id
      name
      environmentId
      title
      path
      roles
      intercom
      titleColor
      items {
        sizeSmall
        sizeMedium
        sizeLarge
        type
        formId
        tableId
        indicatorId
        chartId
        buttonId
        fullSize
        subItems
      }
    }
    forms(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
    charts(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
    tables(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
    roles(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
    indicators(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
    buttons(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
@withMessage
export default class View extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    view: PropTypes.object,
    collections: PropTypes.object,
    forms: PropTypes.object,
    tables: PropTypes.object,
    roles: PropTypes.object,
    indicators: PropTypes.object,
    match: PropTypes.object,
    buttons: PropTypes.object,
    charts: PropTypes.object
  }

  getSizeOptions() {
    return range(12).map(index => ({label: `${12 - index}/12`, value: String(12 - index)}))
  }

  getTypes() {
    return [
      {label: 'Formulario', value: 'form', result: 'forms'},
      {label: 'Tabla', value: 'table', result: 'tables'},
      {label: 'Gráfico', value: 'chart', result: 'charts'},
      {label: 'Indicador', value: 'indicator', result: 'indicators'},
      {label: 'Contenido', value: 'layout'},
      {label: 'Botón', value: 'button', result: 'buttons'}
    ]
  }

  renderComponentSelector(item) {
    if (!item.type) return null
    if (item.type === 'layout') return null
    const option = this.getTypes().find(type => item.type === type.value)
    if (!option) return null
    const result = this.props[option.result] || {}
    const items = result.items || []
    const orderedItems = clone(items).sort((a, b) =>
      a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1
    )
    return (
      <div className="col-xs-12 col-sm-4">
        <div className="label">{option.label}</div>
        {items.length ? (
          <Field fieldName={`${item.type}Id`} type={Select} options={orderedItems} />
        ) : (
          `No hay ${option.label}`
        )}
      </div>
    )
  }

  renderFullSizeCheckbox(item) {
    if (!item.type) return null
    if (item.type === 'layout') return null
    return (
      <div className="col-xs-12 col-sm-4">
        <div className="label">Pantalla completa</div>
        <Field fieldName="fullSize" type={Checkbox} />
      </div>
    )
  }

  renderSubItem(item) {
    if (!item.type) return null
    if (item.type !== 'layout') return null
    return <Field fieldName="subItems" type={ArrayComponent} renderItem={this.renderItem} />
  }

  @autobind
  renderItem(item) {
    return (
      <div className={styles.content}>
        <div className="label">Tamaño</div>
        <br />
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
        <div className="divider" />
        <div className="label">Contenido</div>
        <br />
        <div className="row">
          <div className="col-xs-12 col-sm-4">
            <div className="label">Tipo</div>
            <Field fieldName="type" type={Select} options={this.getTypes()} />
          </div>
          {this.renderComponentSelector(item)}
          {this.renderFullSizeCheckbox(item)}
        </div>
        {this.renderSubItem(item)}
      </div>
    )
  }

  @autobind
  onSuccess() {
    this.props.showMessage('Los campos fueron guardados')
  }

  @autobind
  removeView() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('La vista fue eliminada')
    this.props.history.push(`/${environmentId}/views`)
  }

  render() {
    if (!this.props.view) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.view.name}</Breadcrumbs>
        <AutoForm
          mutation="updateView"
          getErrorFieldLabel={() => translate('general.thisField')}
          ref="form"
          only="view"
          onSuccess={this.onSuccess}
          doc={{
            viewId: this.props.view._id,
            view: cloneDeep(this.props.view)
          }}>
          <Field fieldName="view" type={ObjectField}>
            <div className="label">Ruta</div>
            <Field fieldName="path" type={Text} />
            <div className="description">Debe empezar con /</div>
            <div className="label">Nombre</div>
            <Field fieldName="name" type={Text} />
            <div className="label">Título</div>
            <Field fieldName="title" type={Text} />
            <div className="label">Color del Título</div>
            <Field fieldName="titleColor" type={ColorPicker} />
            <div className="label">Mostrar Intercom</div>
            <Field fieldName="intercom" type={Checkbox} />
            <div className="label">Contenido</div>
            <Field fieldName="items" type={ArrayComponent} renderItem={this.renderItem} />
            <div className="label">Roles</div>
            <Field fieldName="roles" type={Select} multi options={this.props.roles.items} />
          </Field>
        </AutoForm>
        <br />
        <div className={styles.buttonContainer}>
          <div>
            <Button to={`/${this.props.view.environmentId}/views`} style={{marginRight: 10}}>
              Cancelar
            </Button>
            <MutationButton
              label="Eliminar"
              title="¿Confirma que desea eliminar esta vista?"
              confirmText="Confirmar"
              mutation="removeView"
              onSuccess={this.removeView}
              params={{viewId: this.props.view._id}}
              danger
            />
          </div>
          <div>
            <Button onClick={() => this.refs.form.submit()} primary>
              Guardar
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
