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
import ObjectField from 'App/components/fields/ObjectField'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import cloneDeep from 'lodash/cloneDeep'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import autobind from 'autobind-decorator'

@withGraphQL(gql`
  query button($buttonId: ID, $environmentId: ID) {
    button(buttonId: $buttonId) {
      _id
      name
      title
      environmentId
      afterHooksIds
      buttonType
      buttonText
      icon
      url
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
      {label: 'Icon', value: 'icon'}
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
        <div className="label">Redireccionar a esta url (opcional)</div>
        <Field fieldName="url" type={Text} />
      </div>
    )
  }

  renderSelectIcon() {
    return (
      <div style={{marginTop: 20}}>
        <div className="label">Icono</div>
        <Field fieldName="icon" type={Select} options={iconOptions} />
        <div className="label">Redireccionar a esta url (opcional)</div>
        <Field fieldName="url" type={Text} />
      </div>
    )
  }

  renderButtonOptions(button) {
    if (button.buttonType === 'icon') return this.renderSelectIcon()
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
              <div className="label">Hooks</div>
              <Field
                fieldName="afterHooksIds"
                type={Select}
                multi
                options={this.props.hooks.items}
              />
              <WithValue>{button => this.renderButtonOptions(button)}</WithValue>
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
                message="¿Quieres eliminar este button?"
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
