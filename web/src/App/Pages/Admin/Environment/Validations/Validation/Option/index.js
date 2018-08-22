import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import {Field, WithValue} from 'simple-react-form'
import getField from 'App/helpers/fields/getField'
import ObjectField from 'App/components/fields/ObjectField'
import Constant from 'App/components/fields/Constant'
import schemaToField from 'App/components/schemaToField'
import autobind from 'autobind-decorator'
import Select from 'orionsoft-parts/lib/components/fields/Select'

export default class Option extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    schema: PropTypes.object,
    indicators: PropTypes.object,
    optionsPreview: PropTypes.object
  }

  getTypes() {
    return [
      {value: 'fixed', label: 'Valor fijo'},
      {value: 'parameter', label: 'Parámetro'},
      {value: 'indicator', label: 'Indicador'}
    ]
  }

  renderParameterOptions() {
    return (
      <div>
        <div className="label">Nombre de la variable</div>
        <Field fieldName="parameterName" type={getField('string')} />
      </div>
    )
  }

  renderFixedValue() {
    return (
      <div className={styles.fixedValue}>
        <div className="label">Valor</div>
        <Field
          fieldName="fixed.value"
          type={schemaToField(this.props.schema.type, this.props.schema)}
          field={{options: this.props.optionsPreview}}
          {...this.props.schema.fieldOptions}
          parentCollection={this.props.schema.parentCollection || null}
        />
      </div>
    )
  }

  renderIndicatorOptions() {
    return (
      <div>
        <div className="label">Indicador</div>
        <Field fieldName="indicatorId" type={Select} options={this.props.indicators.items} />
      </div>
    )
  }

  @autobind
  renderTypeOption(option) {
    if (!option) return
    if (option.type === 'fixed') {
      return this.renderFixedValue()
    } else if (option.type === 'parameter') {
      return this.renderParameterOptions()
    } else if (option.type === 'indicator') {
      return this.renderIndicatorOptions()
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <Field fieldName={this.props.name} type={ObjectField}>
          <div className={styles.label}>{this.props.schema.label}</div>
          <div className="row">
            {this.props.schema.fixed
              ? [
                <Field key={0} fieldName="type" type={Constant} constant="fixed" />,
                <div key={1} className="col-xs-12 col-sm-6">
                  {this.renderFixedValue()}
                </div>
              ]
              : [
                <div key={0} className="col-xs-12 col-sm-6">
                  <div className="label">Tipo</div>
                  <Field fieldName="type" type={getField('select')} options={this.getTypes()} />
                </div>,
                <div key={1} className="col-xs-12 col-sm-6">
                  <WithValue>{this.renderTypeOption}</WithValue>
                </div>
              ]}
          </div>
        </Field>
      </div>
    )
  }
}
