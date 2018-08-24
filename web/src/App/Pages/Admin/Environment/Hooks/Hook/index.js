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
import Select from 'orionsoft-parts/lib/components/fields/Select'

@withGraphQL(gql`
  query hook($hookId: ID, $environmentId: ID) {
    hook(hookId: $hookId) {
      _id
      name
      environmentId
      functionTypeId
      options
      validationsIds
    }
    functionTypes {
      value: _id
      label: name
      optionsParams
    }
    validations(limit: 200, environmentId: $environmentId) {
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
    hook: PropTypes.object,
    showMessage: PropTypes.func,
    match: PropTypes.object,
    functionTypes: PropTypes.array,
    validations: PropTypes.object
  }

  remove() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Elemento eliminado satisfactoriamente!')
    this.props.history.push(`/${environmentId}/hooks`)
  }

  getOptionsPreview(item) {
    return mapValues(mapValues(item.options, 'fixed'), 'value')
  }

  @autobind
  renderOptions(item) {
    if (!item.functionTypeId) return
    const functionType = this.props.functionTypes.find(f => f.value === item.functionTypeId)
    if (!functionType) return
    if (!functionType.optionsParams) return
    const fields = Object.keys(functionType.optionsParams).map(name => {
      const schema = functionType.optionsParams[name]
      return (
        <Option
          key={name}
          name={name}
          schema={schema}
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
    if (!this.props.hook) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.hook.name}</Breadcrumbs>
        <Section
          top
          title={`Editar hook ${this.props.hook.name}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateHook"
            ref="form"
            only="hook"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              hookId: this.props.hook._id,
              hook: this.props.hook
            }}>
            <Field fieldName="hook" type={ObjectField}>
              <div className="label">Nombre</div>
              <Field fieldName="name" type={getField('string')} />
              <div className="label">Función</div>
              <Field
                fieldName="functionTypeId"
                type={getField('select')}
                options={this.props.functionTypes}
              />
              <div className="label">Validaciones</div>
              <Field
                fieldName="validationsIds"
                type={Select}
                multi
                options={this.props.validations.items}
              />
              <div className="description">Si pasa todas las validaciones el hook se ejecuta</div>
              <WithValue>{this.renderOptions}</WithValue>
            </Field>
          </AutoForm>
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button to={`/${this.props.hook.environmentId}/hooks`} style={{marginRight: 10}}>
                Cancelar
              </Button>
              <MutationButton
                label="Eliminar"
                title="Eliminar Hook"
                message="¿Quieres eliminar este hook?"
                confirmText="Eliminar"
                mutation="removeHook"
                onSuccess={() => this.remove()}
                params={{hookId: this.props.hook._id}}
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
