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
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import {Field} from 'simple-react-form'

@withGraphQL(gql`
  query getForm($formId: ID, $environmentId: ID) {
    form(formId: $formId) {
      _id
      name
      type
      collectionId
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
    form: PropTypes.object,
    collections: PropTypes.object
  }

  getFormTypes() {
    return [{label: 'Crear', value: 'create'}, {label: 'Actualizar', value: 'update'}]
  }

  render() {
    if (!this.props.form) return
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
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
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
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
        </Section>
      </div>
    )
  }
}
