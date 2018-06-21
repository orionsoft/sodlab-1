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
import {Field} from 'simple-react-form'
import autobind from 'autobind-decorator'

@withGraphQL(gql`
  query getRole($roleId: ID) {
    role(roleId: $roleId) {
      _id
      name
    }
  }
`)
@withMessage
export default class Form extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    role: PropTypes.object,
    collections: PropTypes.object,
    match: PropTypes.object
  }

  @autobind
  removeRole() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('El rol fue eliminado')
    this.props.history.push(`/admin/environments/${environmentId}/roles`)
  }

  @autobind
  onSuccess() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Los campos fueron guardados')
    this.props.history.push(`/admin/environments/${environmentId}/roles`)
  }

  render() {
    if (!this.props.role) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.role.name}</Breadcrumbs>
        <Section
          top
          title={`Editar rol ${this.props.role.name}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateRole"
            ref="form"
            only="role"
            onSuccess={this.onSuccess}
            doc={{
              roleId: this.props.role._id,
              role: this.props.role
            }}>
            <Field fieldName="role" type={ObjectField}>
              <div className="label">Nombre</div>
              <Field fieldName="name" type={Text} />
            </Field>
          </AutoForm>
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button onClick={() => this.refs.form.submit()} primary>
                Guardar
              </Button>
            </div>
            <div>
              <MutationButton
                label="Eliminar"
                title="¿Confirma que desea eliminar este rol?"
                confirmText="Confirmar"
                mutation="removeRole"
                onSuccess={this.removeRole}
                params={{roleId: this.props.role._id}}
                danger
              />
            </div>
          </div>
        </Section>
      </div>
    )
  }
}
