import React from 'react'
import styles from './styles.css'
import {Field} from 'simple-react-form'
import ObjectField from 'App/components/fields/ObjectField'
import PropTypes from 'prop-types'
import Option from './Option'

export default class IndicatorOptions extends React.Component {
  static propTypes = {
    indicatorType: PropTypes.object
  }

  static defaultProps = {
    fieldName: 'options',
    label: 'Opciones'
  }

  render() {
    const {indicatorType} = this.props
    if (!indicatorType.optionsParams) return null

    const fields = Object.keys(indicatorType.optionsParams).map(name => {
      const schema = indicatorType.optionsParams[name]
      return <Option key={name} name={name} schema={schema} />
    })

    return (
      <div className={styles.container}>
        <Field fieldName="options" type={ObjectField}>
          {fields}
        </Field>
      </div>
    )
  }
}
