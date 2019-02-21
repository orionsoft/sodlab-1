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
import Checkbox from 'App/components/fieldTypes/checkbox/Field'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import {Field, WithValue} from 'simple-react-form'
import autobind from 'autobind-decorator'
import Fields from './Fields'
import iconOptions from 'App/components/Icon/options'
import ColorPicker from 'App/components/fields/ColorPicker'

@withGraphQL(gql`
  query getForm($formId: ID, $environmentId: ID) {
    form(formId: $formId) {
      _id
      title
      name
      type
      collectionId
      environmentId
      updateVariableName
      hideEmpty
      emptyFormText
      onSuccessViewPath
      afterHooksIds
      validationsIds
      submitButtonText
      submitButtonColor
      submitButtonBgColor
      submitButtonIcon
      resetButtonText
      buttonAlignment
      requireTwoFactor
      roles
      onSuccessEnvironmentVariables
      fields {
        fieldName
        type
        optional
        fixed
        showField
        parameterName
        requiredField
        requiredValue
        requiredParameter
        requiredType
        editableLabel
        indicatorId
        editableDefaultValue
        indicatorDefaultValue
        sizeSmall
        sizeMedium
        sizeLarge
      }
      reset
      collection {
        _id
        fields {
          name
          label
          type
          options
          optional
        }
      }
    }
    collections(limit: 200, environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
    hooks(limit: 200, environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
    validations(limit: 200, environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
    indicators(limit: 200, environmentId: $environmentId) {
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
  }
`)
@withMessage
export default class Form extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    form: PropTypes.object,
    collections: PropTypes.object,
    hooks: PropTypes.object,
    indicators: PropTypes.object,
    validations: PropTypes.object,
    match: PropTypes.object,
    roles: PropTypes.object
  }

  getFormTypes() {
    return [{label: 'Crear', value: 'create'}, {label: 'Editar', value: 'update'}]
  }

  @autobind
  onSuccess() {
    this.props.showMessage('Los campos fueron guardados')
  }

  @autobind
  removeForm() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('El formulario fue eliminado')
    this.props.history.push(`/${environmentId}/forms`)
  }

  getUpdateVariableTypes() {
    return [{label: 'Parametro', value: 'parameter'}, {label: 'Editable', value: 'editable'}]
  }

  renderUpdateOptions() {
    return (
      <div style={{marginTop: 15}}>
        <div className="label">Nombre de la variable</div>
        <Field fieldName="updateVariableName" type={Text} />
        <div className="label">Esconder el formulario si no existe la variable</div>
        <Field
          fieldName="hideEmpty"
          type={Select}
          options={[{label: 'Si', value: true}, {label: 'No', value: false}]}
        />
        <div className="label">Texto a mostrar en un formulario vacio</div>
        <Field fieldName="emptyFormText" type={Text} />
      </div>
    )
  }

  renderExtraOptions(form) {
    if (form.type === 'update') return this.renderUpdateOptions()
    return null
  }

  renderCollection() {
    const {form, collections} = this.props
    const data = collections.items.find(collection => {
      return form.collectionId === collection.value
    })
    return <div className={styles.name}>{data.label}</div>
  }

  renderSuccessEnvironmentVariables() {
    const {collection} = this.props.form
    let options = collection.fields.map(field => ({label: field.label, value: field.name}))
    options = [{label: 'ID', value: '_id'}, ...options]
    return <Field fieldName="onSuccessEnvironmentVariables" type={Select} multi options={options} />
  }

  renderButtonAlignmentOptions() {
    const options = [
      {label: 'Izquierda', value: 'flex-start'},
      {label: 'Centro', value: 'center'},
      {label: 'Derecha', value: 'flex-end'}
    ]
    return <Field fieldName="buttonAlignment" type={Select} options={options} />
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
              <div className="label">Título</div>
              <Field fieldName="title" type={Text} />
              <div className="label">Nombre</div>
              <Field fieldName="name" type={Text} />
              <div className="label">Tipo</div>
              <Field fieldName="type" type={Select} options={this.getFormTypes()} />
              <div className="label">Colección (No se puede cambiar)</div>
              {this.renderCollection()}
              <WithValue>{form => this.renderExtraOptions(form)}</WithValue>
              <div className="label">Ir a una ruta al terminar</div>
              <Field fieldName="onSuccessViewPath" type={Text} />
              <div className="label">Validaciones</div>
              <Field
                fieldName="validationsIds"
                type={Select}
                multi
                options={this.props.validations.items}
              />
              <div className="label">Hooks</div>
              <Field
                fieldName="afterHooksIds"
                type={Select}
                multi
                options={this.props.hooks.items}
              />
              <div className="label">Detener la ejecución de los hooks si ocurre algún error</div>
              <Field
                fieldName="shouldStopHooksOnError"
                type={Select}
                options={[{label: 'Si', value: true}, {label: 'No', value: false}]}
              />
              <div className="label">Roles</div>
              <Field fieldName="roles" type={Select} multi options={this.props.roles.items} />
              <div className="label">Variables a pasar a la vista</div>
              {this.renderSuccessEnvironmentVariables()}
              <div className="label">Texto de botón para confirmar (opcional)</div>
              <Field fieldName="submitButtonText" type={Text} />
              <div className="label">(Opcional) Icono de botón para confirmar</div>
              <Field fieldName="submitButtonIcon" type={Select} options={iconOptions} />
              <div className="label">(Opcional) Color del texto del botón para confirmar</div>
              <Field fieldName="submitButtonColor" type={ColorPicker} />
              <div className="label">(Opcional) Color de fondo del botón para confirmar</div>
              <Field fieldName="submitButtonBgColor" type={ColorPicker} />
              <div className="label">(opcional) Habilitar limpiar formulario</div>
              <Field fieldName="reset" type={Checkbox} label="Habilitar limpiar formulario" />
              <div className="label">(opcional) Texto de botón para limpiar formulario</div>
              <Field fieldName="resetButtonText" type={Text} />
              <div className="label">(opcional) Alinear botones</div>
              {this.renderButtonAlignmentOptions()}
              <div className="label">Requerir autenticación de dos factores</div>
              <Field fieldName="requireTwoFactor" type={Checkbox} label="Requiere dos factores" />
            </Field>
          </AutoForm>
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button to={`/${this.props.form.environmentId}/forms`} style={{marginRight: 10}}>
                Cancelar
              </Button>
              <MutationButton
                label="Eliminar"
                title="¿Quieres eliminar este formulario?"
                confirmText="Eliminar"
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
        <Fields form={this.props.form} indicators={this.props.indicators} />
      </div>
    )
  }
}
