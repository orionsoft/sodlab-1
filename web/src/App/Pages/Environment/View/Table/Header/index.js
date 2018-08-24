import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import ExportDataTable from './ExportDataTable'
import ImportDataTable from './ImportDataTable'

export default class Header extends React.Component {
  static propTypes = {
    table: PropTypes.object,
    params: PropTypes.object,
    parameters: PropTypes.object
  }

  render() {
    if (!this.props.table) return null
    const {exportable, importData, collectionId} = this.props.table
    return (
      <div className={styles.container}>
        <div className="row">
          {exportable && <ExportDataTable {...this.props} />}
          {importData && <ImportDataTable collectionId={collectionId} />}
        </div>
      </div>
    )
  }
}
