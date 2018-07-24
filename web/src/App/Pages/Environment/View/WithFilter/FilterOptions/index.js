import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Fields from 'App/components/AutoForm/Fields'
import {Form} from 'simple-react-form'
import autobind from 'autobind-decorator'
import schemaToField from 'App/components/schemaToField'
import fieldTypes from 'App/components/fieldTypes'

export default class FilterOptions extends React.Component {
  static propTypes = {
    options: PropTypes.object,
    onChange: PropTypes.func,
    filter: PropTypes.object,
    hasFilter: PropTypes.bool,
    validationErrors: PropTypes.object
  }

  state = {}

  @autobind
  onChange(options) {
    this.props.onChange(options)
  }

  @autobind
  schemaToField(type, field) {
    if (!field.fieldType) return schemaToField(type, field)
    return fieldTypes[field.fieldType].field
  }

  getErrorMessages() {
    if (!this.props.validationErrors) return
    return this.props.validationErrors
  }

  render() {
    if (!this.props.filter) return null
    const {formSchema} = this.props.filter
    if (!formSchema) return null
    return (
      <div className={styles.container}>
        <Form
          state={this.props.options}
          errorMessages={this.getErrorMessages()}
          onChange={this.onChange}>
          <Fields schemaToField={this.schemaToField} params={formSchema} />
        </Form>
      </div>
    )
  }
}
