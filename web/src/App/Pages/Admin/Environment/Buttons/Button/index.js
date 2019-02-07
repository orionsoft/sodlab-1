import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import iconOptions from 'App/components/Icon/options'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import {withRouter} from 'react-router'
import {Field, WithValue} from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Number from 'orionsoft-parts/lib/components/fields/numeral/Number'
import ObjectField from 'App/components/fields/ObjectField'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import cloneDeep from 'lodash/cloneDeep'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import autobind from 'autobind-decorator'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'

@withGraphQL(gql`
  query button($buttonId: ID, $environmentId: ID) {
    button(buttonId: $buttonId) {
      _id
      name
      title
      environmentId
      afterHooksIds
      itemNumberResult
      firstHook
      lastHook
      buttonType
      buttonText
      icon
      url
      requireTwoFactor
      goBack
      hsmHookId
      postItemToUrl
      helperType
      parameters {
        parameterName
        value
      }
    }
    hooks(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
@withRouter
@withMessage
export default class ButtonComponent extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    button: PropTypes.object,
    hooks: PropTypes.object,
    showMessage: PropTypes.func,
    match: PropTypes.object,
    collections: PropTypes.object
  }

  getButtonTypes() {
    return [
      {label: 'Botón', value: 'button'},
      {label: 'Texto', value: 'text'},
      {label: 'Icon', value: 'icon'},
      {label: 'Volver atrás', value: 'goBack'},
      {label: 'HSM', value: 'hsm'},
      {
        label: 'Enviar parámetros de la vista, user e item seleccionado en formato JSON',
        value: 'postItemToUrl'
      }
    ]
  }

  remove() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Elemento eliminado satisfactoriamente!')
    this.props.history.push(`/${environmentId}/buttons`)
  }

  renderTextField() {
    return (
      <div style={{marginTop: 20}}>
        <div className="label">Etiqueta</div>
        <Field fieldName="buttonText" type={Text} />
      </div>
    )
  }

  renderSelectIcon() {
    return (
      <div style={{marginTop: 20}}>
        <div className="label">Icono</div>
        <Field fieldName="icon" type={Select} options={iconOptions} />
      </div>
    )
  }

  renderHsmOptions() {
    return (
      <div style={{marginTop: 20}}>
        <div className="label">Etiqueta</div>
        <Field fieldName="buttonText" type={Text} />
        <div className="label">Hook HSM</div>
        <Field fieldName="hsmHookId" type={Select} options={this.props.hooks.items} />
      </div>
    )
  }

  renderPostItemOptions() {
    return (
      <div style={{marginTop: 20}}>
        <div className="label">Tipo</div>
        <Field
          fieldName="helperType"
          type={Select}
          options={[
            {label: 'Botón', value: 'button'},
            {label: 'Texto', value: 'text'},
            {label: 'Icon', value: 'icon'}
          ]}
        />
        <div className="label">Etiqueta</div>
        <Field fieldName="buttonText" type={Text} />
        <div className="label">Icono</div>
        <Field fieldName="icon" type={Select} options={iconOptions} />
        <div className="label">Url a la cual enviar los datos</div>
        <Field fieldName="postItemToUrl" type={Text} />
      </div>
    )
  }

  renderGoBack() {
    return (
      <div style={{marginTop: 20}}>
        <div className="label">
          Volver atrás (si se elige esta opción, se invalida la redirección a otra vista)
        </div>
        <Field fieldName="goBack" type={Checkbox} label="Activar volver atrás" />
      </div>
    )
  }

  renderButtonOptions(button) {
    if (button.buttonType === 'icon') return this.renderSelectIcon()
    if (button.buttonType === 'hsm') return this.renderHsmOptions()
    if (button.buttonType === 'goBack') return this.renderGoBack()
    if (button.buttonType === 'postItemToUrl') return this.renderPostItemOptions()
    if (button.buttonType) {
      return this.renderTextField()
    }
  }

  @autobind
  renderItems(field) {
    return (
      <div className="row">
        <div className="col-xs-12 col-md-6">
          <div className="label">Parametro</div>
          <Field fieldName="parameterName" type={Text} />
        </div>
        <div className="col-xs-12 col-md-6">
          <div className="label">Valor</div>
          <Field fieldName="value" type={Text} />
        </div>
      </div>
    )
  }

  render() {
    if (!this.props.button) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.button.title}</Breadcrumbs>
        <Section
          top
          title={`Editar botón ${this.props.button.title}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateButton"
            ref="form"
            only="button"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              buttonId: this.props.button._id,
              button: cloneDeep(this.props.button)
            }}>
            <Field fieldName="button" type={ObjectField}>
              <div className="label">Nombre</div>
              <Field fieldName="name" type={Text} />
              <div className="label">Título</div>
              <Field fieldName="title" type={Text} />
              <div className="label">Tipo</div>
              <Field fieldName="buttonType" type={Select} options={this.getButtonTypes()} />
              <div className="label">
                (opcional) Mensaje a mostrar después de ejecutar exitosamente el botón
              </div>
              <Field fieldName="onSuccessMessage" type={Text} />
              <div className="label">
                (opcional) Mensaje a mostrar al ocurrir un error al ejecutar el botón
              </div>
              <Field fieldName="onErrorMessage" type={Text} />
              <div className="label">Hooks</div>
              <Field
                fieldName="afterHooksIds"
                type={Select}
                multi
                options={this.props.hooks.items}
              />
              <div className="label">
                (opcional) Resultado de los hooks a usar. Influye en la interpretación de la url y
                envío de datos. Posibles valores: 0 (parámetros iniciales), 1 (resultado del primer
                hook), N (resultado del hook N), "params" (opción por defecto, es igual al resultado
                del último hook)
              </div>
              <Field fieldName="hookResult" type={Text} />
              <div className="label">
                (opcional) Resultado del item a utilizar en las operaciones batch
              </div>
              <Field fieldName="itemNumberResult" type={Number} />
              <div className="label">
                (opcional) Detener la ejecución de los hooks si ocurre algún error
              </div>
              <Field
                fieldName="shouldStopHooksOnError"
                type={Select}
                options={[{label: 'Si', value: true}, {label: 'No', value: false}]}
              />
              <div className="label">
                (opcional) Hook a ejecutar antes de la ejecución de los otros hooks (se ejecuta
                sobre el primer item que recibe)
              </div>
              <Field fieldName="firstHook" type={Select} options={this.props.hooks.items} />
              <div className="label">
                (opcional) Hook a ejecutar después de la ejecución de los otros hooks (se ejecuta
                sobre el primer item que recibe)
              </div>
              <Field fieldName="lastHook" type={Select} options={this.props.hooks.items} />
              <div className="label">(opcional) Redireccionar a esta url</div>
              <Field fieldName="url" type={Text} />
              <div className="label">(opcional) Requerir autenticación de dos factores</div>
              <Field fieldName="requireTwoFactor" type={Checkbox} label="Requiere dos factores" />
              <WithValue>{button => this.renderButtonOptions(button)}</WithValue>
              <div className="label">
                (opcional) Parámetros a usar para la redirección de url, ejecución de hooks o envío
                de datos. <br />
                Si se quiere usar el botón por si sólo para ejecutar hooks (no en una tabla), se
                debe especificar un parámetro llamado "_id" y en valor el nombre de algún parámetro
                que posea la vista (si el valor entregado no existe como parámetro en la vista, este
                se interpreta como un valor fijo)
              </div>
              <Field fieldName="parameters" type={ArrayComponent} renderItem={this.renderItems} />
            </Field>
          </AutoForm>
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button to={`/${this.props.button.environmentId}/buttons`} style={{marginRight: 10}}>
                Cancelar
              </Button>
              <MutationButton
                label="Eliminar"
                title="Eliminar button"
                message="¿Quieres eliminar este botón?"
                confirmText="Eliminar"
                mutation="deleteButton"
                onSuccess={() => this.remove()}
                params={{buttonId: this.props.button._id}}
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
