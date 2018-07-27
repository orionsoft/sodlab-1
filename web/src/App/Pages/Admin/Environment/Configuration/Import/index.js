import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import autobind from 'autobind-decorator'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'

@withMutation(gql`
  mutation importEnvironment($environmentId: ID, $data: String) {
    importEnvironment(environmentId: $environmentId, data: $data) {
      _id
      name
    }
  }
`)
@withMessage
export default class Import extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    importEnvironment: PropTypes.func,
    environment: PropTypes.object
  }

  state = {}

  @autobind
  async importEnvironment(data) {
    try {
      await this.props.importEnvironment({
        environmentId: this.props.environment._id,
        data
      })
      this.props.showMessage('Listo')
    } catch (error) {
      this.props.showMessage(error)
    }
  }

  @autobind
  async onChange() {
    const file = this.refs.input.files[0]
    if (!file) return
    this.setState({loading: true})
    const content = await new Promise(function(resolve, reject) {
      const reader = new FileReader()
      reader.onload = function(event) {
        const contents = event.target.result
        resolve(contents)
      }
      reader.readAsText(file)
    })
    try {
      JSON.parse(content)
      this.importEnvironment(content)
    } catch (e) {
      this.props.showMessage('Error al leer el archivo')
    }
    this.setState({loading: false})
  }

  renderInput() {
    if (this.state.loading) return
    return (
      <div>
        <label htmlFor="file-upload" className={styles.label}>
          Subir un archivo...
        </label>
        <input
          ref="input"
          id="file-upload"
          type="file"
          className={styles.input}
          onChange={this.onChange}
        />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <Section
          title="Importar configuración"
          description="Elimina la configuración actual del ambiente y usa la nueva configuración">
          {this.renderInput()}
        </Section>
      </div>
    )
  }
}
