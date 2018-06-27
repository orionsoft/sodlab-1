import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import PaginatedList from 'App/components/Crud/List'
import autobind from 'autobind-decorator'
import ItemValue from '../ItemValue'

@withGraphQL(gql`
  query getTable($tableId: ID) {
    table(tableId: $tableId) {
      _id
      title
      collectionId
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

  @autobind
  onSelect(item) {
    console.log(item)
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

  render() {
    const {table} = this.props
    return (
      <div className={styles.container}>
        <PaginatedList
          title={table.title}
          name="tableResult"
          canUpdate={false}
          params={{tableId: table._id}}
          fields={this.getFields()}
          onSelect={this.onSelect}
          allowSearch={false}
        />
      </div>
    )
  }
}
