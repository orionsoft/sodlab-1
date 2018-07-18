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

  render() {
    const {table, parameters} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{table.title}</div>
        </div>
        <WithFilter
          filters={table.filters}
          allowsNoFilter={table.allowsNoFilter}
          parameters={parameters}>
          {this.renderPaginated}
        </WithFilter>
        <Watch
          environmentId={table.environmentId}
          parent={this}
          collectionId={table.collectionId}
        />
      </div>
    )
  }
}
