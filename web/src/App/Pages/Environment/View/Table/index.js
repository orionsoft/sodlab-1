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
import {FaArrowsAlt, FaClose} from 'react-icons/lib/fa'

@withGraphQL(gql`
  query getTable($tableId: ID) {
    table(tableId: $tableId) {
      _id
      title
      collectionId
      environmentId
      allowsNoFilter
      fullSize
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

  state = {filterId: null, fullSize: false}

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
    const {collectionId} = this.props.table
    try {
      return (
        <TableField
          state={this.props.state}
          setEnvironment={this.props.setEnvironment}
          doc={doc}
          field={field}
          parameters={this.props.parameters}
          table={this.props.table}
          collectionField={collectionField}
          collectionId={collectionId}
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
        options: field.options,
        render: doc => this.renderField({field, doc})
      }
    })
  }

  @autobind
  renderPaginated({filterId, filterOptions}) {
    const {table} = this.props
    return (
      <PaginatedList
        title={null}
        setRef={ref => (this.paginated = ref)}
        name="tableResult"
        queryFunctionName={`paginated_${table.collectionId}`}
        canUpdate={false}
        params={{
          tableId: table._id,
          filterId,
          filterOptions
        }}
        fields={this.getFields()}
        onSelect={this.onSelect}
        allowSearch={false}
      />
    )
  }

  @autobind
  fullScreen() {
    this.setState({fullSize: !this.state.fullSize})
  }

  renderFullSize() {
    return this.state.fullSize ? (
      <FaClose onClick={this.fullScreen} style={{cursor: 'pointer'}} />
    ) : (
      <FaArrowsAlt onClick={this.fullScreen} style={{cursor: 'pointer'}} />
    )
  }

  @autobind
  renderButtons(table) {
    return <div className="row end-xs">{table.fullSize && this.renderFullSize()}</div>
  }

  renderTable() {
    const {table, parameters} = this.props
    return (
      <div>
        <div className={styles.header}>
          <div className="row">
            <div className="col-xs-10 col-sm-">
              <div className={styles.title}>{table.title}</div>
            </div>
            <div className="col-xs-2 col-sm-">{this.renderButtons(table)}</div>
          </div>
        </div>
        <WithFilter
          filters={table.filters}
          allowsNoFilter={table.allowsNoFilter}
          parameters={parameters}>
          {this.renderPaginated}
        </WithFilter>
        <Watch environmentId={table.environmentId} collectionId={table.collectionId} />
      </div>
    )
  }

  render() {
    return (
      <div className={this.state.fullSize ? styles.fullSize : styles.container} key="table">
        {this.renderTable()}
      </div>
    )
  }
}
