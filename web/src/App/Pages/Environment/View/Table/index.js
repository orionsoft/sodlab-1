import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import PaginatedList from 'App/components/Crud/List'
import autobind from 'autobind-decorator'
import {Form, Field} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import TableField from './Field'

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
        type
        options
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
    table: PropTypes.object,
    state: PropTypes.object,
    setEnvironment: PropTypes.func
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

  getCollectionField(fieldName) {
    return this.props.table.collection.fields.find(field => field.name === fieldName)
  }

  renderField({field, doc}) {
    const collectionField = this.getCollectionField(field.fieldName)
    try {
      return (
        <TableField
          state={this.props.state}
          setEnvironment={this.props.setEnvironment}
          doc={doc}
          field={field}
          collectionField={collectionField}
        />
      )
    } catch (e) {
      return e.message
    }
  }

  getFields() {
    const tableFields = this.props.table.fields
    if (!tableFields.length) return [{title: 'ID', value: '_id'}]

    return tableFields.map(field => {
      return {
        title: field.label,
        name: 'data',
        render: doc => this.renderField({field, doc})
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
