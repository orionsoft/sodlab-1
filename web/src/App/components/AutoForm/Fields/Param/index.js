import React from 'react'
import styles from './styles.css'
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
    only: PropTypes.string,
    passProps: PropTypes.object,
    fromEnvironment: PropTypes.bool,
    fields: PropTypes.array
  }

  renderObjectFields(fields, sections) {
    if (sections) {
      return sections.map(field => {
        if (field.type === 'section') {
          return (
            <div className={`col-xs-12 col-sm-12 col-md-12`}>
              <h4 className={styles.section}>{field.editableLabel}</h4>
            </div>
          )
        } else {
          return (
            <AutoFormField
              key={field.fieldName}
              field={fields[field.fieldName]}
              fieldName={field.fieldName}
              schemaToField={this.props.schemaToField}
              passProps={this.props.passProps}
            />
          )
        }
      })
    } else {
      return Object.keys(fields).map(key => {
        return (
          <AutoFormField
            key={key}
            field={fields[key]}
            fieldName={key}
            schemaToField={this.props.schemaToField}
            passProps={this.props.passProps}
          />
        )
      })
    }
  }

  renderField(field) {
    const {type, fieldOptions = {}} = field
    if (isArray(type) && isPlainObject(type[0])) {
      const Component = this.props.schemaToField('array', field)
      return (
        <Field
          fieldName={this.props.fieldName}
          type={Component}
          {...fieldOptions}
          {...this.props.passProps}>
          {this.renderObjectFields(type[0])}
        </Field>
      )
    } else if (isPlainObject(type)) {
      const Component = this.props.schemaToField('plainObject', field)
      return (
        <Field
          fieldName={this.props.fieldName}
          type={Component}
          {...fieldOptions}
          {...this.props.passProps}>
          <div className="row">{this.renderObjectFields(type, this.props.fields)}</div>
        </Field>
      )
    } else {
      const Component = this.props.schemaToField(type, field)
      return (
        <Field
          fieldName={this.props.fieldName}
          type={Component}
          {...fieldOptions}
          {...this.props.passProps}
        />
      )
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

  renderFieldElements(field, fieldName) {
    return (
      <div className="autoform-field">
        {this.renderLabel()}
        {this.renderField(field, fieldName)}
        {this.renderDescription()}
      </div>
    )
  }

  render() {
    const {field, fieldName} = this.props
    if (!field) return null
    if (this.props.fromEnvironment) {
      return this.renderField(field, fieldName)
    } else if (field.sizeSmall && field.sizeMedium && field.sizeLarge) {
      return (
        <div
          className={`col-xs-${field.sizeSmall} col-sm-${field.sizeMedium} col-md-${
            field.sizeLarge
          }`}>
          {this.renderFieldElements(field, fieldName)}
        </div>
      )
    } else {
      return (
        <div className={`col-xs-12 col-sm-12 col-md-12`}>
          {this.renderFieldElements(field, fieldName)}
        </div>
      )
    }
  }
}
