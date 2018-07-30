import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import AutoForm from 'App/components/AutoForm'
import Breadcrumbs from '../../Breadcrumbs'
import Section from 'App/components/Section'
import Fields from 'App/components/AutoForm/Fields'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import fieldTypes from 'App/components/fieldTypes'
import autobind from 'autobind-decorator'
import schemaToField from 'App/components/schemaToField'
import translate from 'App/i18n/translate'
import Role from './Role'

@withGraphQL(gql`
  query getEnviromentUser($environmentUserId: ID, $environmentId: ID) {
    environmentUser(environmentUserId: $environmentUserId) {
      _id
      email
      profile
      ...adminEnvironmentUserRoleFragment
    }
    environment(environmentId: $environmentId) {
      _id
      serializedProfileSchema
    }
  }
  ${Role.fragment}
`)
@withMessage
export default class EnvironmentUser extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    showMessage: PropTypes.func,
    history: PropTypes.object,
    environmentUser: PropTypes.object,
    environment: PropTypes.object,
    params: PropTypes.object,
    match: PropTypes.object
  }

  @autobind
  onSuccess() {
    this.props.showMessage('El perfil fue guardado')
  }

  @autobind
  removeEnvironmentUser() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('El usuario fue eliminado')
    this.props.history.push(`/${environmentId}/users`)
  }

  @autobind
  schemaToField(type, field) {
    if (!field.fieldType) return schemaToField(type, field)
    if (!fieldTypes[field.fieldType]) {
      throw new Error('Field type not found for ' + field.fieldType)
    }
    return fieldTypes[field.fieldType].field
  }

  render() {
    if (!this.props.environmentUser || !this.props.environment) return null
    const params = {profile: {type: this.props.environment.serializedProfileSchema || {}}}
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.environmentUser.email}</Breadcrumbs>
        <Section
          top
          title={`Editar ${this.props.environmentUser.email}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="setEnvironmentUserProfile"
            ref="form"
            only="profile"
            getErrorFieldLabel={() => translate('general.thisField')}
            doc={{
              environmentUserId: this.props.environmentUser._id,
              profile: this.props.environmentUser.profile
            }}
            onSuccess={this.onSuccess}>
            {({parent}) => (
              <Fields
                schemaToField={this.schemaToField}
                parent={parent}
                params={params}
                passProps={{environmentUserId: this.props.environmentUser._id}}
              />
            )}
          </AutoForm>
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button
                to={`/${this.props.match.params.environmentId}/users`}
                style={{marginRight: 10}}>
                Cancelar
              </Button>
              <MutationButton
                label="Eliminar"
                title="¿Confirma que desea eliminar este usuario?"
                confirmText="Confirmar"
                mutation="removeEnvironmentUser"
                onSuccess={this.removeEnvironmentUser}
                params={{environmentUserId: this.props.environmentUser._id}}
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
        <Role
          environmentUser={this.props.environmentUser}
          environmentId={this.props.match.params.environmentId}
        />
      </div>
    )
  }
}
