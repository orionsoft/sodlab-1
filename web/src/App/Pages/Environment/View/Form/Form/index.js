import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import AutoForm from 'App/components/AutoForm'
import Fields from 'App/components/AutoForm/Fields'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import fieldTypes from 'App/components/fieldTypes'
import autobind from 'autobind-decorator'
import schemaToField from 'App/components/schemaToField'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import cloneDeep from 'lodash/cloneDeep'
import translate from 'App/i18n/translate'
import {withRouter} from 'react-router'

@withGraphQL(gql`
  query getFormItem($formId: ID, $itemId: ID) {
    itemData: form(formId: $formId) {
      _id
      item(itemId: $itemId) {
        _id
        data
      }
    }
  }
`)
@withMessage
@withRouter
export default class Form extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    form: PropTypes.object,
    state: PropTypes.object,
    itemData: PropTypes.object,
    itemId: PropTypes.string,
    parameters: PropTypes.object,
    setEnvironment: PropTypes.func,
    fields: PropTypes.array
  }

  state = {
    docData: {}
  }

  componentDidMount() {
    this.setState({docData: this.getData()})
  }

  renderResetButton() {
    if (!this.props.form.reset) return null
    return (
      <Button onClick={() => this.setState({data: {}})}>
        {this.props.form.resetButtonText || 'Limpiar'}
      </Button>
    )
  }

  renderSubmitButton() {
    const text = this.props.form.type === 'create' ? 'Crear' : 'Guardar'
    return (
      <Button onClick={() => this.refs.form.submit()} primary>
        {this.props.form.submitButtonText || text}
      </Button>
    )
  }

  @autobind
  onSuccess(result) {
    this.setState({docData: {}})
    this.props.setEnvironment({
      [this.props.form.updateVariableName]: null
    })
    this.props.showMessage('Se completó con exito')
    const rawPath = this.props.form.onSuccessViewPath
    if (rawPath) {
      let path = rawPath
      path = path.replace(`:_id`, result._id)
      for (const key of Object.keys(result.data)) {
        const value = result.data[key]
        path = path.replace(`:${key}`, value)
      }
      this.props.history.push(path)
    }
  }

  @autobind
  schemaToField(type, field) {
    if (!field.fieldType) return schemaToField(type, field)
    if (!fieldTypes[field.fieldType]) {
      throw new Error('Field type not found for ' + field.fieldType)
    }
    return fieldTypes[field.fieldType].field
  }

  getItemId() {
    return this.props.itemId
  }

  getErrorFieldLabel() {
    return translate('general.thisField')
  }

  getItemData() {
    if (!this.props.itemData) return
    if (!this.props.itemData.item) return
    return cloneDeep(this.props.itemData.item.data)
  }

  getData() {
    const doc = this.getItemData() || {}
    const params = this.props.form.serializedParams || {}
    for (const key of Object.keys(params)) {
      const field = params[key]
      if (field.formFieldType === 'parameter') {
        doc[key] = this.props.parameters[field.parameterName]
      }
    }
    return doc
  }

  @autobind
  getParams() {
    const schema = cloneDeep(this.props.form.serializedParams) || {}

    Object.keys(schema)
      .map(key => {
        const field = schema[key]
        return {
          ...field,
          key
        }
      })
      .filter(field => field.formFieldType === 'editable')
      .map(field => {
        // remove item
        if (
          field.requiredValue === this.state.docData[field.requiredField] &&
          field.requiredType !== null
        ) {
          if (!field.showField) {
            delete schema[field.key]
            return field
          } else {
            schema[field.key] = field
            return field
          }
        } else {
          if (field.showField) {
            delete schema[field.key]
            return field
          } else {
            schema[field.key] = field
            return field
          }
        }
      })
      .filter(field => field)

    const params = {
      data: {
        type: schema
      }
    }

    return params
    // if (filter.showField) {
    //   console.log('filter true')
    //   params = {
    //     data: {
    //       type: schema
    //     }
    //   }
    // } else {[]
    //   const response = Object.values(schema).filter(
    //     field => field.requiredField !== filter.requiredField
    //   )
    //   params = {
    //     data: {
    //       type: schema
    //     }
    //   }
    // }

    // return params
    // for (const key of Object.keys(schema)) {
    //   const field = schema[key]
    //   if (field.formFieldType !== 'editable') {
    //     delete schema[key]
    //   } else {
    //     if (
    //       field.requiredType === 'editable' &&
    //       (!this.state.docData[field.requiredField] ||
    //         this.state.docData[field.requiredField] !== field.requiredValue)
    //     ) {
    //       if (this.state.docData[key]) {
    //         const state = omit(this.state.docData, key)
    //         this.setState({docData: state})
    //       }
    //       delete schema[key]
    //     } else if (
    //       field.requiredType === 'parameter' &&
    //       !this.props.parameters[field.requiredParameter]
    //     ) {
    //       if (this.state.docData[key]) {
    //         const state = omit(this.state.docData, key)
    //         this.setState({docData: state})
    //       }
    //       delete schema[key]
    //     }
    //   }

    //   if (field.requiredValue === this.state.docData[field.requiredField]) {
    //     if (!field.showField) {
    //       delete schema[key]
    //     }
    //   }

    //   if (field.requiredValue !== this.state.docData[field.requiredField]) {
    //     if (!field.showField) {
    //       schema[key] = field
    //     }
    //   }
    // }
  }

  needsData() {
    return this.props.form.type === 'update'
  }

  renderItemNotFound() {
    return <div className={styles.itemNotFound}>No se encontró el documento</div>
  }

  filterFields() {
    return this.props.fields
  }

  @autobind
  onChange(docData) {
    this.setState({docData})
  }

  render() {
    if (this.needsData() && !this.getItemData()) return this.renderItemNotFound()
    return (
      <div className={styles.container}>
        <AutoForm
          mutation="submitForm"
          ref="form"
          only="data"
          getErrorFieldLabel={this.getErrorFieldLabel}
          onChange={changes => this.onChange(changes.data)}
          doc={{
            formId: this.props.form._id,
            data: this.state.docData,
            itemId: this.getItemId()
          }}
          onSuccess={this.onSuccess}>
          <Fields
            fromEnvironment
            schemaToField={this.schemaToField}
            params={this.getParams()}
            passProps={{formId: this.props.form._id}}
            fields={this.filterFields()}
          />
        </AutoForm>
        <br />
        {this.renderResetButton()}
        {this.renderSubmitButton()}
      </div>
    )
  }
}
