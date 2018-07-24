import React from 'react'
import styles from './styles.css'
import {WithValue, Field} from 'simple-react-form'
import ObjectField from 'App/components/fields/ObjectField'
import Fields from 'App/components/AutoForm/Fields'
import schemaToField from 'App/components/schemaToField'
import PropTypes from 'prop-types'

export default class IndicatorOptions extends React.Component {
  static propTypes = {
    indicatorType: PropTypes.object,
    fieldName: PropTypes.string,
    label: PropTypes.node,
    field: PropTypes.object
  }

  static defaultProps = {
    fieldName: 'options',
    label: 'Opciones'
  }

  render() {
    if (!this.props.indicatorType.optionsParams) return null
    return (
      <div className={styles.container}>
        <WithValue>
          {field => (
            <div className={styles.container}>
              <div className="description">{this.props.label}</div>
              <Field fieldName={this.props.fieldName} type={ObjectField}>
                <Fields
                  schemaToField={schemaToField}
                  params={this.props.indicatorType.optionsParams}
                  passProps={{field}}
                />
              </Field>
            </div>
          )}
        </WithValue>
      </div>
    )
  }
}
