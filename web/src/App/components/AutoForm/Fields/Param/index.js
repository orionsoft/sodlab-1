import React from 'react'
import PropTypes from 'prop-types'
import isArray from 'lodash/isArray'
import isPlainObject from 'lodash/isPlainObject'
import {Field} from 'simple-react-form'
import getInLocale from 'App/i18n/getInLocale'

export default class AutoFormField extends React.Component {
  static propTypes = {
    field: PropTypes.object,
    fieldName: PropTypes.string,
    schemaToField: PropTypes.func,
    only: PropTypes.string
  }

  renderObjectFields(fields) {
    return Object.keys(fields).map(key => {
      return (
        <AutoFormField
          key={key}
          field={fields[key]}
          fieldName={key}
          schemaToField={this.props.schemaToField}
        />
      )
    })
  }

  renderField(field) {
    const {type} = field
    if (isArray(type) && isPlainObject(type[0])) {
      const Component = this.props.schemaToField('array', field)
      return (
        <Field fieldName={this.props.fieldName} type={Component}>
          {this.renderObjectFields(type[0])}
        </Field>
      )
    } else if (isPlainObject(type)) {
      const Component = this.props.schemaToField('plainObject', field)
      return (
        <Field fieldName={this.props.fieldName} type={Component}>
          {this.renderObjectFields(type)}
        </Field>
      )
    } else {
      const Component = this.props.schemaToField(type, field)
      return <Field fieldName={this.props.fieldName} type={Component} />
    }
  }

  renderLabel() {
    if (this.props.only === this.props.fieldName) return
    if (!this.props.field.label) return
    return <div className="label">{getInLocale(this.props.field.label)}</div>
  }

  renderDescription() {
    if (!this.props.field.description) return
    return <div className="description">{getInLocale(this.props.field.description)}</div>
  }

  render() {
    return (
      <div className="autoform-field">
        {this.renderLabel()}
        {this.renderField(this.props.field, this.props.fieldName)}
        {this.renderDescription()}
      </div>
    )
  }
}
