import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import {withRouter} from 'react-router'
import {Field, WithValue} from 'simple-react-form'
import getField from 'App/helpers/fields/getField'
import ObjectField from 'App/components/fields/ObjectField'
import autobind from 'autobind-decorator'
import Option from './Option'
import mapValues from 'lodash/mapValues'

@withGraphQL(gql`
  query validation($validationId: ID, $environmentId: ID) {
    validation(validationId: $validationId) {
      _id
      name
      environmentId
      validationTypeId
      options
    }
    validationTypes {
      value: _id
      label: name
      optionsParams
    }
    indicators(limit: 200, environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
@withRouter
@withMessage
export default class Hook extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    validation: PropTypes.object,
    showMessage: PropTypes.func,
    match: PropTypes.object,
    validationTypes: PropTypes.object,
    indicators: PropTypes.object
  }

  remove() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Validación eliminada satisfactoriamente!')
    this.props.history.push(`/${environmentId}/validations`)
  }

  getOptionsPreview(item) {
    return mapValues(mapValues(item.options, 'fixed'), 'value')
  }

  @autobind
  renderOptions(item) {
    if (!item.validationTypeId) return
    const validationType = this.props.validationTypes.find(f => f.value === item.validationTypeId)
    if (!validationType) return
    if (!validationType.optionsParams) return
    const fields = Object.keys(validationType.optionsParams).map(name => {
      const schema = validationType.optionsParams[name]
      return (
        <Option
          key={name}
          name={name}
          schema={schema}
          indicators={this.props.indicators}
          optionsPreview={this.getOptionsPreview(item)}
        />
      )
    })
    return (
      <div className={styles.options}>
        <Field fieldName="options" type={ObjectField}>
          {fields}
        </Field>
      </div>
    )
  }

  render() {
    if (!this.props.validation) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.validation.name}</Breadcrumbs>
        <Section
          top
          title={`Editar validation ${this.props.validation.name}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateValidation"
            ref="form"
            only="validation"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              validationId: this.props.validation._id,
              validation: this.props.validation
            }}>
            <Field fieldName="validation" type={ObjectField}>
              <div className="label">Nombre</div>
              <Field fieldName="name" type={getField('string')} />
              <div className="label">Función</div>
              <Field
                fieldName="validationTypeId"
                type={getField('select')}
                options={this.props.validationTypes}
              />
              <WithValue>{this.renderOptions}</WithValue>
            </Field>
          </AutoForm>
          <br />
          <Button
            to={`/${this.props.validation.environmentId}/validations`}
            style={{marginRight: 10}}>
            Cancelar
          </Button>
          <MutationButton
            label="Eliminar"
            title="Eliminar Hook"
            message="¿Quieres eliminar este validation?"
            confirmText="Eliminar"
            mutation="removeHook"
            onSuccess={() => this.remove()}
            params={{validationId: this.props.validation._id}}
            danger
          />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
        </Section>
      </div>
    )
  }
}
