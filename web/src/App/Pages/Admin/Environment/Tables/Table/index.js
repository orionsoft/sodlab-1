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
import {Field} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import ObjectField from 'App/components/fields/ObjectField'
import autobind from 'autobind-decorator'
import cloneDeep from 'lodash/cloneDeep'

@withGraphQL(gql`
  query getForm($tableId: ID, $environmentId: ID) {
    table(tableId: $tableId) {
      _id
      title
      environmentId
      collectionId
      filterId
      fields {
        fieldName
        label
      }
      collection {
        _id
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
  }
`)
@withMessage
export default class Link extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    table: PropTypes.object,
    collections: PropTypes.object,
    forms: PropTypes.object,
    match: PropTypes.object,
    filters: PropTypes.object
  }

  state = {}

  componentDidMount() {
    this.setState(cloneDeep(this.props.table))
  }

  getFilters() {
    return this.props.filters.items.filter(filter => filter.collectionId)
  }

  @autobind
  removeTable() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('La tabla fueron guardados')
    this.props.history.push(`/${environmentId}/tables`)
  }

  @autobind
  onSuccess() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Los campos fueron guardados')
    this.props.history.push(`/${environmentId}/tables`)
  }

  renderCollectionFields() {
    let {collection} = this.props.table
    return (
      <Field fieldName="fields" type={ArrayComponent}>
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <div className="label">Campo</div>
            <Field fieldName="fieldName" type={Select} options={collection.fields} />
          </div>
          <div className="col-xs-12 col-sm-6">
            <div className="label">Etiqueta</div>
            <Field fieldName="label" type={Text} />
          </div>
        </div>
      </Field>
    )
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
            ref="form"
            only="table"
            onSuccess={this.onSuccess}
            doc={{
              tableId: this.props.table._id,
              table: this.props.table
            }}>
            <Field fieldName="table" type={ObjectField}>
              <div className="label">Título</div>
              <Field fieldName="title" type={Text} />
              <div className="label">Filtro</div>
              <Field fieldName="filterId" type={Select} options={this.getFilters()} />
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
