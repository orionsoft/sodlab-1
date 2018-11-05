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
      reset
      submitButtonText
      resetButtonText
      onSuccessViewPath
      fieldsList {
        fieldName
        type
        editableLabel
        test
      }
    }
  }
`)
export default class Form extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    form: PropTypes.object,
    parameters: PropTypes.object,
    setEnvironment: PropTypes.func
  }

  state = {}

  getItemId() {
    if (this.props.form.type === 'create') return null
    return this.props.parameters[this.props.form.updateVariableName]
  }

  renderNoItem() {
    return <div className={styles.noItem}>Selecciona un documento</div>
  }

  renderForm() {
    const props = {
      form: this.props.form,
      formId: this.props.form._id,
      data: this.state.data || {},
      itemId: this.getItemId(),
      parameters: this.props.parameters || {},
      setEnvironment: this.props.setEnvironment,
      fields: this.props.form.fieldsList
    }
    if (props.form.type === 'update' && !props.itemId) return this.renderNoItem()
    return <FormContent {...props} />
  }

  render() {
    if (!this.props.form) return null
    const {form} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.title}>{form.title}</div>
        {this.renderForm()}
      </div>
    )
  }
}
