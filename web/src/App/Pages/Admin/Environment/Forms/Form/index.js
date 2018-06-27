import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import ObjectField from 'App/components/fields/ObjectField'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import {Field} from 'simple-react-form'
import autobind from 'autobind-decorator'

@withGraphQL(gql`
  query getForm($formId: ID, $environmentId: ID) {
    form(formId: $formId) {
      _id
      name
      type
      collectionId
      environmentId
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
export default class Form extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    form: PropTypes.object,
    collections: PropTypes.object,
    match: PropTypes.object
  }

  getFormTypes() {
    return [{label: 'Crear', value: 'create'}, {label: 'Actualizar', value: 'update'}]
  }

  @autobind
  onSuccess() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Los campos fueron guardados')
    this.props.history.push(`/${environmentId}/forms`)
  }

  @autobind
  removeForm() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('El formulario fue eliminado')
    this.props.history.push(`/${environmentId}/forms`)
  }

  render() {
    if (!this.props.form) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.form.name}</Breadcrumbs>
        <Section
          top
          title={`Editar formulario ${this.props.form.name}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateForm"
            ref="form"
            only="form"
            onSuccess={this.onSuccess}
            doc={{
              formId: this.props.form._id,
              form: this.props.form
            }}>
            <Field fieldName="form" type={ObjectField}>
              <div className="label">Nombre</div>
              <Field fieldName="name" type={Text} />
              <div className="label">Tipo</div>
              <Field fieldName="type" type={Select} options={this.getFormTypes()} />
              <div className="label">Colección</div>
              <Field
                fieldName="collectionId"
                type={Select}
                options={this.props.collections.items}
              />
            </Field>
          </AutoForm>
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button
                to={`/${this.props.form.environmentId}/forms`}
                style={{marginRight: 10}}>
                Cancelar
              </Button>
              <MutationButton
                label="Eliminar"
                title="¿Confirma que desea eliminar este formulario?"
                confirmText="Confirmar"
                mutation="removeForm"
                onSuccess={this.removeForm}
                params={{formId: this.props.form._id}}
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
