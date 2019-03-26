import React from 'react'
import styles from './styles.css'
import IconButton from 'orionsoft-parts/lib/components/IconButton'
import PropTypes from 'prop-types'
import icons from 'App/components/Icon/icons'
import MutationButton from 'App/components/MutationButton'
import XLSX from 'xlsx'

export default class ExportDataTable extends React.Component {
  static propTypes = {
    table: PropTypes.object,
    params: PropTypes.object,
    parameters: PropTypes.object
  }

  downloadFile(result, name) {
    console.log(result)
    XLSX.writeFile(result, `${name}.xlsx`)
  }

  render() {
    const {table, params} = this.props
    const onClick = () => this.export()
    const icon = icons['MdFileDownload']
    return (
      <div className={styles.container}>
        <MutationButton
          label="Descargar"
          title="¿Quieres descargar la información de esta tabla?"
          confirmText="Confirmar"
          mutation="exportTable"
          onSuccess={result => this.downloadFile(result, 'Documentos')}
          params={{
            tableId: table._id,
            filterId: params.filterId,
            filterOptions: params.filterOptions,
            params: this.props.parameters
          }}>
          <IconButton onPress={onClick} icon={icon} tooltip="Exportar" size={18} />
        </MutationButton>
      </div>
    )
  }
}
