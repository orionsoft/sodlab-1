import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import autobind from 'autobind-decorator'
import Section from 'App/components/Section'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Loading from 'orionsoft-parts/lib/components/Loading'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import * as XLSX from 'xlsx'

@withMutation(gql`
  mutation importTable($collectionId: ID, $items: [JSON], $action: String) {
    importTable(collectionId: $collectionId, items: $items, action: $action)
  }
`)
@withMessage
export default class ImportDataTable extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    collectionId: PropTypes.string,
    importTable: PropTypes.func
  }

  state = {}

  @autobind
  async importData(items, action) {
    const {collectionId} = this.props
    const message =
      action === 'insert'
        ? 'Se han insertado los datos satisfactoriamente!'
        : 'Se han actualizado los datos satisfactoriamente!'
    try {
      await this.props.importTable({collectionId, items, action})
      this.props.showMessage(message)
    } catch (error) {
      this.props.showMessage(error)
    }
  }

  @autobind
  async onChange(action) {
    const file = action === 'insert' ? this.refs.insert.files[0] : this.refs.update.files[0]
    if (!file) return
    this.setState({loading: true})
    const content = await new Promise(function(resolve, reject) {
      const reader = new FileReader()
      reader.onload = function(event) {
        const bstr = event.target.result
        const workbook = XLSX.read(bstr, {
          type: 'binary',
          cellDates: true
        })
        resolve(
          XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
            raw: true
          })
        )
      }
      reader.readAsBinaryString(file)
    })
    try {
      await this.importData(content, action)
    } catch (e) {
      this.props.showMessage('Error al leer el archivo')
    }
    this.setState({loading: false})
  }

  renderLoading() {
    return (
      <div className={styles.loading}>
        <Loading size={35} />
      </div>
    )
  }

  renderUpdateInput() {
    if (this.state.loading) return this.renderLoading()
    return (
      <div className={styles.button} key="menu">
        <label htmlFor="file-update" className={styles.label}>
          Actualizar datos en la tabla
        </label>
        <input
          ref="update"
          id="file-update"
          type="file"
          className={styles.input}
          onChange={() => this.onChange('update')}
        />
      </div>
    )
  }

  renderInsertInput() {
    if (this.state.loading) return this.renderLoading()
    return (
      <div className={styles.button} key="menu">
        <label htmlFor="file-insert" className={styles.label}>
          Insertar datos en la tabla
        </label>
        <input
          ref="insert"
          id="file-insert"
          type="file"
          className={styles.input}
          onChange={() => this.onChange('insert')}
        />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.insert}>
          <Section
            title="Insertar datos en la colección"
            description="Agrega datos a la colección a través de un archivo excel">
            {this.renderInsertInput()}
          </Section>
        </div>
        <div className={styles.update}>
          <Section
            title="Actualizar datos en la colección"
            description="Actualiza datos de la colección a través de un archivo excel">
            {this.renderUpdateInput()}
          </Section>
        </div>
      </div>
    )
  }
}
