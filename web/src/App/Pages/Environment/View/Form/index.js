import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import FormContent from './Form'
import styles from './styles.css'

@withGraphQL(gql`
  query getForm($formId: ID) {
    form(formId: $formId) {
      _id
      title
      type
      serializedParams
      updateVariableName
      hideEmpty
      emptyFormText
      reset
      submitButtonText
      submitButtonIcon
      submitButtonColor
      submitButtonBgColor
      resetButtonText
      buttonAlignment
      onSuccessViewPath
      onSuccessEnvironmentVariables
      fieldsList {
        fieldName
        type
        editableLabel
        showField
      }
    }
  }
`)
export default class Form extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    form: PropTypes.object,
    parameters: PropTypes.object,
    setEnvironment: PropTypes.func,
    timezone: PropTypes.string
  }

  state = {}

  getItemId() {
    if (this.props.form.type === 'create') return null
    return this.props.parameters[this.props.form.updateVariableName]
  }

  renderForm(itemId) {
    const props = {
      form: this.props.form,
      formId: this.props.form._id,
      data: this.state.data || {},
      itemId,
      parameters: this.props.parameters || {},
      setEnvironment: this.props.setEnvironment,
      timezone: this.props.timezone,
      fields: this.props.form.fieldsList
    }
    return <FormContent {...props} />
  }

  renderEmptyForm({hideEmpty, emptyFormText}) {
    if (hideEmpty) {
      return null
    } else {
      const text = emptyFormText ? emptyFormText : 'Selecciona un item'
      return (
        <div className={styles.container}>
          <div className={styles.noItem}>{text}</div>
        </div>
      )
    }
  }

  render() {
    if (!this.props.form) return null
    const itemId = this.getItemId()
    const {form} = this.props
    if (this.props.form.type === 'update' && !itemId) return this.renderEmptyForm(form)
    return (
      <div className={styles.container}>
        {form.title && <div className={styles.title}>{form.title}</div>}
        {this.renderForm(itemId)}
      </div>
    )
  }
}
