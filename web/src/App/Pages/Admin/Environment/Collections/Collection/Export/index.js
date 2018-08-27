import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import MutationButton from 'App/components/MutationButton'
import XLSX from 'xlsx'
import PropTypes from 'prop-types'

export default class Export extends React.Component {
  static propTypes = {
    collectionId: PropTypes.string
  }

  downloadFile(result, name) {
    XLSX.writeFile(result, `${name}.xlsx`)
  }

  render() {
    const {collectionId} = this.props
    return (
      <div className={styles.container}>
        <Section
          title="Exportar cabeceras"
          description="Exporta las cabeceras de la colección a un Excel">
          <MutationButton
            label="Exportar Cabeceras"
            title="¿Quieres descargar las cabeceras de esta colección?"
            confirmText="Confirmar"
            mutation="exportHeaders"
            onSuccess={result => this.downloadFile(result, 'Cabeceras')}
            params={{
              collectionId
            }}
          />
        </Section>
      </div>
    )
  }
}
