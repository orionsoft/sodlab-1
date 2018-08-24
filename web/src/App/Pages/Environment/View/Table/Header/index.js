import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import ExportDataTable from './ExportDataTable'

export default class Header extends React.Component {
  static propTypes = {
    table: PropTypes.object,
    params: PropTypes.object,
    parameters: PropTypes.object
  }

  render() {
    if (!this.props.table) return null
    const {exportable} = this.props.table
    return (
      <div className={styles.container}>
        <div className="row">
          <div className="col-xs-6 col-sm-">
            {exportable && <ExportDataTable {...this.props} />}
          </div>
        </div>
      </div>
    )
  }
}
