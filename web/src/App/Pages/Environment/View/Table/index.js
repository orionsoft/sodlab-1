import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import PaginatedList from 'App/components/Crud/List'
import autobind from 'autobind-decorator'
import ItemValue from '../ItemValue'
import {Form, Field} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'

@withGraphQL(gql`
  query getTable($tableId: ID) {
    table(tableId: $tableId) {
      _id
      title
      collectionId
      allowsNoFilter
      filters {
        _id
        name
      }
      fields {
        fieldName
        label
      }
      collection {
        fields {
          name
          label
          type
          options
        }
      }
    }
  }
`)
export default class Table extends React.Component {
  static propTypes = {
    table: PropTypes.object
  }

  state = {filterId: null}

  @autobind
  onSelect(item) {
    console.log(item)
  }

  componentDidMount() {
    this.setDefaultFilter()
  }

  setDefaultFilter() {
    const {table} = this.props
    if (table.allowsNoFilter) return
    if (!table.filters) return
    if (table.filters.length !== 1) return
    this.setState({filterId: table.filters[0]._id})
  }

  needsFilter() {
    const {table} = this.props
    if (table.allowsNoFilter) return null
    if (table.allowsNoFilter) return null
  }

  getFields() {
    const tableFields = this.props.table.fields
    const fields = this.props.table.collection.fields
      .filter(field => {
        if (!tableFields.length) return true
        return !!tableFields.find(tbf => tbf.fieldName === field.name)
      })
      .map(collectionField => {
        const tableField = tableFields.length
          ? tableFields.find(tbf => tbf.fieldName === collectionField.name)
          : null
        return {
          ...collectionField,
          label: tableField ? tableField.label || collectionField.label : collectionField.label
        }
      })
    return fields.map(field => {
      return {
        title: field.label,
        name: 'data',
        render: ({data}) => <ItemValue value={data[field.name]} field={field} />
      }
    })
  }

  renderSelectFilter() {
    return <div className={styles.needToSelectFilter}>Debes seleccionar un filtro</div>
  }

  renderFilterOptions() {
    const {table} = this.props
    const options = []
    for (const filter of table.filters) {
      options.push({label: filter.name, value: filter._id})
    }
    const hasOptions = table.allowsNoFilter ? options.length : options.length > 1
    if (!hasOptions) return
    return (
      <div>
        <Form state={this.state} onChange={changes => this.setState(changes)}>
          <div className="label">Elige un filtro</div>
          <Field fieldName="filterId" placeholder="Sin filtro" type={Select} options={options} />
        </Form>
      </div>
    )
  }

  renderPaginated() {
    const {table} = this.props
    if (!table.allowsNoFilter && !this.state.filterId) return this.renderSelectFilter()
    return (
      <PaginatedList
        title={null}
        name="tableResult"
        canUpdate={false}
        params={{tableId: table._id, filterId: this.state.filterId}}
        fields={this.getFields()}
        onSelect={this.onSelect}
        allowSearch={false}
      />
    )
  }

  render() {
    const {table} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{table.title}</div>
          {this.renderFilterOptions()}
        </div>
        {this.renderPaginated()}
      </div>
    )
  }
}
