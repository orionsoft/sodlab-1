import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import icons from 'App/components/Icon/icons'
import {withApollo} from 'react-apollo'
import gql from 'graphql-tag'
import exportToFile from './exportToFile'
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
        <div className={`col-xs-2 col-sm- end-xs`}>
          {exportable && <ExportDataTable {...this.props} />}
        </div>
        <div className={`col-xs-2 col-sm- end-xs`}>
          {exportable && <ExportDataTable {...this.props} />}
        </div>
        <div className={`col-xs-2 col-sm- end-xs`}>
          {exportable && <ExportDataTable {...this.props} />}
        </div>
        <div className={`col-xs-2 col-sm- end-xs`}>
          {exportable && <ExportDataTable {...this.props} />}
        </div>
        <div className={`col-xs-2 col-sm- end-xs`}>
          {exportable && <ExportDataTable {...this.props} />}
        </div>
      </div>
    )
  }
}
