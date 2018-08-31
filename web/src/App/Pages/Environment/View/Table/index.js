import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import PaginatedList from 'App/components/Crud/List'
import autobind from 'autobind-decorator'
import TableField from './Field'
import Watch from './Watch'
import WithFilter from '../WithFilter'
import isEqual from 'lodash/isEqual'
import {clean, validate} from '@orion-js/schema'
import IndicatorResult from './IndicatorResult'
import Header from './Header'
import cloneDeep from 'lodash/cloneDeep'
import values from 'lodash/values'
import SelectionActions from './SelectionActions'

@withGraphQL(gql`
  query getTable($tableId: ID) {
    table(tableId: $tableId) {
      _id
      title
      collectionId
      environmentId
      allowsNoFilter
      footer
      exportable
      filterByDefault
      defaultLimit
      filters {
        _id
        title
        schema: serializedSchema(includeParameters: true)
        formSchema: serializedSchema(includeParameters: false)
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

  state = {filterId: null, selectedItems: {}}

  @autobind
  onSelect(item) {}

  componentDidMount() {
    this.setDefaultFilter()
    this.checkFilterOptionsSchema()
  }

  setDefaultFilter() {
    const {table} = this.props
    const filters = table.filters.map(filter => {
      return filter._id
    })
    if (table.filterByDefault && filters.includes(table.filterByDefault)) {
      return table.filterByDefault
    }
    if (table.allowsNoFilter) return null
    if (!table.filters) return null
    if (table.filters.length !== 1) return null
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

  @autobind
  toggleSelectedItem(itemId, doc) {
    const selectedItems = cloneDeep(this.state.selectedItems)
    if (selectedItems[itemId]) {
      delete selectedItems[itemId]
    } else {
      selectedItems[itemId] = {_id: itemId, ...doc.data}
    }
    this.setState({selectedItems})
  }

  needsFilter() {
    const {table} = this.props
    if (table.allowsNoFilter) return null
  }

  getCollectionField(fieldName) {
    return this.props.table.collection.fields.find(field => field.name === fieldName)
  }

  renderField({field, doc, index}) {
    const collectionField = this.getCollectionField(field.fieldName)
    const {collectionId} = this.props.table
    try {
      return (
        <TableField
          state={this.props.state}
          setEnvironment={this.props.setEnvironment}
          doc={doc}
          field={field}
          fieldIndex={index}
          parameters={this.props.parameters}
          table={this.props.table}
          collectionField={collectionField}
          collectionId={collectionId}
          toggleSelectedItem={() => this.toggleSelectedItem(doc._id, doc)}
          selected={!!this.state.selectedItems[doc._id]}
        />
      )
    } catch (e) {
      return e.message
    }
  }

  getFields() {
    const tableFields = this.props.table.fields
    if (!tableFields.length) return [{title: 'ID', value: '_id'}]
    return tableFields.map((field, index) => {
      return {
        title: field.label,
        name: 'data',
        options: field.options,
        render: doc => this.renderField({field, doc, index})
      }
    })
  }

  renderFooterItem(item) {
    if (item.type === 'indicator') {
      return <IndicatorResult params={this.props.parameters} indicatorId={item.indicatorId} />
    }
    if (item.type === 'text') {
      return <div className={styles.footerText}>{item.text}</div>
    }
    if (item.type === 'parameter') {
      return (
        <div className={styles.footerText}>
          {this.props.parameters[item.parameter] || 'Parámetro Vacío'}
        </div>
      )
    }
  }

  renderFooter(footer) {
    if (!footer) return
    return footer.map((row, index) => {
      const cols = this.getFields().map((field, fieldIndex) => {
        if (row.items[fieldIndex]) {
          return <td key={fieldIndex}>{this.renderFooterItem(row.items[fieldIndex])}</td>
        } else {
          return <td key={fieldIndex} />
        }
      })
      return <tr key={index}>{cols}</tr>
    })
  }

  @autobind
  renderPaginated({filterId, filterOptions}) {
    const {table, parameters} = this.props
    return (
      <div>
        <Header
          table={table}
          params={{
            filterId,
            filterOptions
          }}
          parameters={parameters}
        />
        <PaginatedList
          title={null}
          setRef={ref => (this.paginated = ref)}
          name="tableResult"
          queryFunctionName={`paginated_${table.collectionId}`}
          canUpdate={false}
          params={{
            tableId: table._id,
            filterId: this.state.filterId || filterId,
            filterOptions
          }}
          fields={this.getFields()}
          onSelect={this.onSelect}
          allowSearch={false}
          footer={this.renderFooter(table.footer)}
          defaultLimit={table.defaultLimit}
        />
      </div>
    )
  }

  renderSelectionActions() {
    const docs = values(this.state.selectedItems)
    if (!docs.length) return
    const field = this.props.table.fields.find(field => field.type === 'multipleSelect')
    return <SelectionActions field={field} items={docs} />
  }

  renderTable() {
    const {table, parameters} = this.props
    return (
      <div>
        <div className={styles.header}>
          <div className={styles.title}>{table.title}</div>
        </div>
        {this.renderSelectionActions()}
        <WithFilter
          filters={table.filters}
          allowsNoFilter={table.allowsNoFilter}
          parameters={parameters}
          filterByDefault={this.setDefaultFilter()}>
          {this.renderPaginated}
        </WithFilter>
        <Watch environmentId={table.environmentId} collectionId={table.collectionId} />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container} key="table">
        {this.renderTable()}
      </div>
    )
  }
}
