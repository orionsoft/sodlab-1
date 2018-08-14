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
import {Field, WithValue} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import ObjectField from 'App/components/fields/ObjectField'
import autobind from 'autobind-decorator'
import cloneDeep from 'lodash/cloneDeep'
import translate from 'App/i18n/translate'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'
import FieldOptions from './FieldOptions'

@withGraphQL(gql`
  query getForm($tableId: ID, $environmentId: ID) {
    table(tableId: $tableId) {
      _id
      title
      name
      environmentId
      collectionId
      filtersIds
      allowsNoFilter
      orderFiltersByName
      fields {
        type
        fieldName
        label
        options
      }
      collection {
        _id
        environmentId
        fields {
          value: name
          label
        }
      }
    }
    filters(environmentId: $environmentId) {
      items {
        value: _id
        label: name
        collectionId
      }
    }
    collections(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
@withMessage
export default class Link extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    collections: PropTypes.object,
    history: PropTypes.object,
    table: PropTypes.object,
    forms: PropTypes.object,
    match: PropTypes.object,
    filters: PropTypes.object
  }

  state = {}

  componentDidMount() {
    this.setState(this.props.table)
  }

  static getDerivedStateFromProps(props, state) {
    return state || props.table || {}
  }

  getFilters() {
    return this.props.filters.items.filter(
      filter => filter.collectionId === this.props.table.collectionId
    )
  }

  getErrorFieldLabel() {
    return translate('general.thisField')
  }

  @autobind
  removeTable() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('La tabla fue eliminada')
    this.props.history.push(`/${environmentId}/tables`)
  }

  @autobind
  onSuccess() {
    this.props.showMessage('Los campos fueron guardados')
  }

  renderFieldOptions() {
    let {collection} = this.props.table
    return (
      <WithValue>
        {field => (
          <FieldOptions
            field={field}
            collection={collection}
            environmentId={collection.environmentId}
          />
        )}
      </WithValue>
    )
  }

  renderCollectionFields() {
    const typeOptions = [
      {value: 'field', label: 'Campo'},
      {value: 'selectIconButton', label: 'Seleccionar variable'},
      {value: 'routeIconButton', label: 'Ir a una ruta'},
      {value: 'deleteRowByUser', label: 'Eliminar documento'},
      {value: 'runHooks', label: 'Ejecutar hooks'},
      {value: 'postItem', label: 'Enviar documento a una URL'}
    ]
    return (
      <Field fieldName="fields" type={ArrayComponent}>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-4">
            <div className="label">Tipo</div>
            <Field fieldName="type" type={Select} options={typeOptions} />
          </div>
          {this.renderFieldOptions()}
        </div>
      </Field>
    )
  }

  @autobind
  reset() {
    const fields = this.props.table.collection.fields.map(field => {
      return {
        type: 'field',
        label: field.label,
        fieldName: field.value,
        options: null
      }
    })
    this.setState({fields})
  }

  renderCollection() {
    const {table, collections} = this.props
    const data = collections.items.find(collection => {
      return table.collectionId === collection.value
    })
    return <div className={styles.name}>{data.label}</div>
  }

  render() {
    if (!this.props.table) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.table.title}</Breadcrumbs>
        <Section
          top
          title={`Editar table ${this.props.table.title}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateTable"
            getErrorFieldLabel={this.getErrorFieldLabel}
            ref="form"
            only="table"
            onSuccess={this.onSuccess}
            doc={{
              tableId: this.props.table._id,
              table: cloneDeep(this.state) || cloneDeep(this.props.table) || {}
            }}>
            <Field fieldName="table" type={ObjectField}>
              <div className="label">Nombre</div>
              <Field fieldName="name" type={Text} />
              <div className="label">Título</div>
              <Field fieldName="title" type={Text} />
              <div className="label">Colección (No se puede cambiar)</div>
              {this.renderCollection()}
              <div className="label">Filtros</div>
              <Field fieldName="filtersIds" type={Select} multi options={this.getFilters()} />
              <div className="row">
                <div className="col-xs-6 col-sm-">
                  <div className="label">Se puede usar sin filtro</div>
                  <Field
                    fieldName="allowsNoFilter"
                    type={Checkbox}
                    label="Se puede usar sin filtro"
                  />
                </div>
                <div className="col-xs-6 col-sm-">
                  <div className="label">Ordenar filtros alfabéticamente</div>
                  <Field
                    fieldName="orderFiltersByName"
                    type={Checkbox}
                    label="Ordenar filtros alfabéticamente"
                  />
                </div>
              </div>
              <div className="label">Que campos mostrar</div>
              {this.renderCollectionFields()}
            </Field>
          </AutoForm>
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button to={`/${this.props.table.environmentId}/tables`} style={{marginRight: 10}}>
                Cancelar
              </Button>
              <Button onClick={this.reset} style={{marginRight: 10}}>
                Resetear
              </Button>
              <MutationButton
                label="Eliminar"
                title="¿Confirma que desea eliminar esta tabla?"
                confirmText="Confirmar"
                mutation="removeTable"
                onSuccess={this.removeTable}
                params={{tableId: this.props.table._id}}
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
