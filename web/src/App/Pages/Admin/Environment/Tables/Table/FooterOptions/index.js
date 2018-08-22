import React from 'react'
import styles from './styles.css'
import {Field, WithValue} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import PropTypes from 'prop-types'
import clone from 'lodash/clone'
import TextArea from 'App/components/fields/TextArea'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import autobind from 'autobind-decorator'

export default class FooterOptions extends React.Component {
  static propTypes = {
    indicators: PropTypes.array,
    columns: PropTypes.number
  }

  getTypes() {
    return [
      {label: 'Indicador', value: 'indicator', result: 'indicators'},
      {label: 'Texto', value: 'text'},
      {label: 'Parámetro', value: 'parameter'}
    ]
  }

  renderComponentSelector(item) {
    if (!item.type) return null
    if (item.type !== 'indicator') return null
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

  renderParameterField(item) {
    if (!item.type) return null
    if (item.type !== 'parameter') return null
    return (
      <div className="col-xs-12 col-sm-8">
        <div className="label">Parámetro</div>
        <Field fieldName="parameter" type={Text} />
      </div>
    )
  }

  @autobind
  renderRow(item, index, length) {
    return (
      <div className="row">
        <div className="col-xs-12 col-sm-4">
          <div className="label">Tipo</div>
          <Field fieldName="type" type={Select} options={this.getTypes()} />
        </div>
        {this.renderComponentSelector(item)}
        {this.renderTextField(item)}
        {this.renderParameterField(item)}
      </div>
    )
  }

  renderArrayComp(row) {
    return (
      <div className={styles.content}>
        <div className="label">Fila</div>
        <Field
          fieldName="items"
          draggable={false}
          type={ArrayComponent}
          showAddButton={row.items && row.items.length < this.props.columns}
          renderItem={(item, index) => this.renderRow(item, index, row.items.length)}
        />
      </div>
    )
  }

  render() {
    return <WithValue>{item => this.renderArrayComp(item)}</WithValue>
  }
}
