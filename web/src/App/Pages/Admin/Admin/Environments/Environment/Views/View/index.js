import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import ObjectField from 'App/components/fields/ObjectField'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import {Field} from 'simple-react-form'
import autobind from 'autobind-decorator'
import cloneDeep from 'lodash/cloneDeep'
import range from 'lodash/range'

@withGraphQL(gql`
  query getForm($viewId: ID, $environmentId: ID) {
    view(viewId: $viewId) {
      _id
      name
      environmentId
      title
      path
      items {
        sizeSmall
        sizeMedium
        sizeLarge
        type
        formId
        tableId
      }
    }
    forms(limit: null, environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
    tables(limit: null, environmentId: $environmentId) {
      items {
        value: _id
        label: title
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
    match: PropTypes.object
  }

  getSizeOptions() {
    return range(12).map(index => ({label: `${12 - index}/12`, value: 12 - index}))
  }

  getTypes() {
    return [
      {label: 'Formulario', value: 'form', result: 'forms'},
      {label: 'Tabla', value: 'table', result: 'tables'},
      {label: 'Gráfico', value: 'chart', result: 'chart'},
      {label: 'Indicador', value: 'indicator', result: 'indicator'}
    ]
  }

  renderComponentSelector(item) {
    if (!item.type) return null
    const option = this.getTypes().find(type => item.type === type.value)
    const result = this.props[option.result] || {}
    const items = result.items || []
    return (
      <div className="col-xs-12 col-sm-6">
        <div className="label">{option.label}</div>
        {items.length ? (
          <Field fieldName={`${item.type}Id`} type={Select} options={items} />
        ) : (
          `No hay ${option.label}`
        )}
      </div>
    )
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
        <div className="description">El tamaño depende de kakkasd</div>
        <div className="divider" />
        <div className="label">Contenido</div>
        <br />
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <div className="label">Tipo</div>
            <Field fieldName="type" type={Select} options={this.getTypes()} />
          </div>
          {this.renderComponentSelector(item)}
        </div>
      </div>
    )
  }

  @autobind
  onSuccess() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Los campos fueron guardados')
    this.props.history.push(`/admin/environments/${environmentId}/views`)
  }

  @autobind
  removeView() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('La vista fue eliminada')
    this.props.history.push(`/admin/environments/${environmentId}/views`)
  }

  render() {
    if (!this.props.view) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.view.name}</Breadcrumbs>
        <Section
          top
          title={`Editar vista ${this.props.view.name}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateView"
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

              <div className="label">Contenido</div>
              <Field fieldName="items" type={ArrayComponent} renderItem={this.renderItem} />
            </Field>
          </AutoForm>
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button
                to={`/admin/environments/${this.props.view.environmentId}/views`}
                style={{marginRight: 10}}>
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
        </Section>
      </div>
    )
  }
}
