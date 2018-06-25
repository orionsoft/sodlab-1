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
      fields {
        fieldName
        label
      }
    }
    collections(environmentId: $environmentId) {
      items {
        value: _id
        label: name
        fields {
          value: name
          label
        }
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
    match: PropTypes.object
  }

  state = {}

  componentDidMount() {
    this.setState(cloneDeep(this.props.table))
  }

  @autobind
  onSuccess() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Los campos fueron guardados')
    this.props.history.push(`/admin/environments/${environmentId}/tables`)
  }

  @autobind
  renderFields(fields) {
    return (
      <div className={styles.content}>
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <div className="label">Campo</div>
            <Field fieldName="fieldName" type={Select} options={fields} />
          </div>
          <div className="col-xs-12 col-sm-6">
            <div className="label">Etiqueta</div>
            <Field fieldName="label" type={Text} />
          </div>
        </div>
      </div>
    )
  }

  @autobind
  getCollection(collectionId) {
    let collection = this.props.collections.items.find(
      collection => collection.value === collectionId
    )
    return (
      <Field fieldName="fields" type={ArrayComponent}>
        {this.renderFields(collection.fields)}
      </Field>
    )
  }

  @autobind
  onChangeAutoForm(event) {
    this.setState(event.table)
  }

  render() {
    if (!this.props.table) return
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
              table: this.state
            }}
            onChange={this.onChangeAutoForm}>
            <Field fieldName="table" type={ObjectField}>
              <div className="label">Título</div>
              <Field fieldName="title" type={Text} />
              <div className="label">Colección</div>
              <Field
                fieldName="collectionId"
                type={Select}
                options={this.props.collections.items}
              />
              {this.state.collectionId && this.getCollection(this.state.collectionId)}
            </Field>
          </AutoForm>
          <br />
          <Button
            to={`/admin/environments/${this.props.table.environmentId}/tables`}
            style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
        </Section>
      </div>
    )
  }
}
