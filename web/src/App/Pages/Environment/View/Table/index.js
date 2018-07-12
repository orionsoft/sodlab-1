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
import FilterOptions from './FilterOptions'
import isEqual from 'lodash/isEqual'
import {clean, validate} from '@orion-js/schema'
import Watch from './Watch'

@withGraphQL(gql`
  query getTable($tableId: ID) {
    table(tableId: $tableId) {
      _id
      title
      collectionId
      environmentId
      allowsNoFilter
      filters {
        _id
        name
        schema: serializedSchema
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
    setEnvironment: PropTypes.func,
    parameters: PropTypes.object
  }

  state = {filterId: null}

  @autobind
  onSelect(item) {}

  componentDidMount() {
    this.setDefaultFilter()
    this.checkFilterOptionsSchema()
  }

  setDefaultFilter() {
    const {table} = this.props
    if (table.allowsNoFilter) return
    if (!table.filters) return
    if (table.filters.length !== 1) return
    this.setState({filterId: table.filters[0]._id})
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.filterId !== prevState.filterId) {
      // eslint-disable-next-line
      this.setState({options: null})
      this.checkFilterOptionsSchema()
    }
    if (!isEqual(this.state.options, prevState.options)) this.checkFilterOptionsSchema()
  }

  async checkFilterOptionsSchema() {
    if (!this.state.filterId) {
      return this.setState({filterOptionsAreValid: true, optionValidationErrors: null})
    }
    const filter = this.props.table.filters.find(f => f._id === this.state.filterId)
    if (!filter || !filter.schema) {
      return this.setState({filterOptionsAreValid: true, optionValidationErrors: null})
    }

    const cleaned = await clean(filter.schema, {...this.state.options, ...this.props.parameters})
    try {
      await validate(filter.schema, cleaned)
      this.setState({
        cleanedFilterOptions: cleaned,
        filterOptionsAreValid: true,
        optionValidationErrors: null
      })
    } catch (error) {
      this.setState({
        cleanedFilterOptions: null,
        filterOptionsAreValid: false,
        optionValidationErrors: error.validationErrors
      })
    }
  }

  needsFilter() {
    const {table} = this.props
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
          table={this.props.table}
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

  renderFilterForm() {
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

  renderFilterOptions() {
    if (!this.state.filterId) return
    const filter = this.props.table.filters.find(f => f._id === this.state.filterId)
    if (!filter) return
    return (
      <FilterOptions
        options={this.state.options || {}}
        filter={filter}
        validationErrors={this.state.optionValidationErrors}
        onChange={options => this.setState({options})}
      />
    )
  }

  renderPaginated() {
    const {table} = this.props
    if (!table.allowsNoFilter && !this.state.filterId) return this.renderSelectFilter()
    if (!this.state.filterOptionsAreValid) return
    return (
      <PaginatedList
        title={null}
        setRef={ref => (this.paginated = ref)}
        name="tableResult"
        queryFunctionName={`paginated_${table.collectionId}`}
        canUpdate={false}
        params={{
          tableId: table._id,
          filterId: this.state.filterId,
          filterOptions: this.state.cleanedFilterOptions
        }}
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
          {this.renderFilterForm()}
          {this.renderFilterOptions()}
        </div>
        {this.renderPaginated()}
        <Watch
          environmentId={table.environmentId}
          parent={this}
          collectionId={table.collectionId}
        />
      </div>
    )
  }
}
