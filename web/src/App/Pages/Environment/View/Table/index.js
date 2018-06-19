import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import PaginatedList from 'App/components/Crud/List'
import autobind from 'autobind-decorator'

@withGraphQL(gql`
  query getTable($tableId: ID) {
    table(tableId: $tableId) {
      _id
      title
      collectionId
      collection {
        fields {
          name
          label
          type
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
    return this.props.table.collection.fields.map(field => {
      return {
        title: field.label,
        name: 'data',
        render: ({data}) => data[field.name]
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
          params={{collectionId: table.collectionId}}
          fields={this.getFields()}
          onSelect={this.onSelect}
          allowSearch
        />
      </div>
    )
  }
}
