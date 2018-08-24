import React from 'react'
import styles from './styles.css'
import IconButton from 'orionsoft-parts/lib/components/IconButton'
import PropTypes from 'prop-types'
import icons from 'App/components/Icon/icons'
import {withApollo} from 'react-apollo'
import gql from 'graphql-tag'
import exportToFile from './exportToFile'

@withApollo
export default class Header extends React.Component {
  static propTypes = {
    table: PropTypes.object,
    params: PropTypes.object,
    client: PropTypes.object
  }

  async getItems() {
    const {table, params} = this.props
    const queryString = `query paginated_${
      table.collectionId
    } ($tableId: ID, $filterId: ID, $filterOptions: JSON) {
      result: tableResult (tableId: $tableId, filterId: $filterId, filterOptions: $filterOptions) {
        items {
          _id
          data
        }
      }
    }`
    const query = gql([queryString])
    const {
      data: {
        result: {items}
      }
    } = await this.props.client.query({
      query,
      variables: {
        tableId: table._id,
        filterId: params.filterId,
        filterOptions: params.filterOptions
      }
    })
    return items
  }

  async export() {
    const items = await this.getItems()
    console.log({items})
    exportToFile(items)
  }

  renderExportable() {
    const onClick = () => this.export()
    const icon = icons['MdFileDownload']
    return (
      <div className="col-xs-6 col-sm-">
        <IconButton onPress={onClick} icon={icon} tooltip="Exportar" size={18} />
      </div>
    )
  }

  render() {
    if (!this.props.table) return null
    const {exportable} = this.props.table
    return (
      <div className={styles.container}>
        <div className="row">{exportable && this.renderExportable()}</div>
      </div>
    )
  }
}
