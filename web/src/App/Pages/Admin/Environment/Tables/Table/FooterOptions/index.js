import React from 'react'
import styles from './styles.css'
import {Field} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import PropTypes from 'prop-types'
import clone from 'lodash/clone'
import TextArea from 'App/components/fields/TextArea'

export default class FooterOptions extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    indicators: PropTypes.array
  }

  getTypes() {
    return [
      {label: 'Indicador', value: 'indicator', result: 'indicators'},
      {label: 'Texto', value: 'text'}
    ]
  }

  renderComponentSelector(item) {
    if (!item.type) return null
    if (item.type === 'text') return null
    const option = this.getTypes().find(type => item.type === type.value)
    if (!option) return null
    const items = this.props[option.result] || []
    const orderedItems = clone(items).sort(
      (a, b) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1)
    )
    return (
      <div className="col-xs-12 col-sm-8">
        <div className="label">{option.label}</div>
        {items.length ? (
          <Field fieldName={`${item.type}Id`} type={Select} options={orderedItems} />
        ) : (
          `No hay ${option.label}`
        )}
      </div>
    )
  }

  renderTextField(item) {
    if (!item.type) return null
    if (item.type !== 'text') return null
    return (
      <div className="col-xs-12 col-sm-8">
        <div className="label">Texto</div>
        <Field fieldName="text" type={TextArea} rows={1} />
      </div>
    )
  }

  render() {
    if (!this.props.item) return null
    const {item} = this.props
    return (
      <div className={styles.content}>
        <div className="row">
          <div className="col-xs-12 col-sm-4">
            <div className="label">Tipo</div>
            <Field fieldName="type" type={Select} options={this.getTypes()} />
          </div>
          {this.renderComponentSelector(item)}
          {this.renderTextField(item)}
        </div>
      </div>
    )
  }
}
