import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import autobind from 'autobind-decorator'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withMutation(gql`
  mutation generateExport($environmentId: ID) {
    result: generateExport(environmentId: $environmentId)
  }
`)
@withMessage
export default class Export extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    generateExport: PropTypes.func,
    environment: PropTypes.object
  }

  @autobind
  async generate() {
    try {
      const {result} = await this.props.generateExport({environmentId: this.props.environment._id})
      this.downloadFile(result, `${this.props.environment._id}.sodlabx`, 'application/json')
      this.props.showMessage('Success')
    } catch (error) {
      this.props.showMessage(error)
    }
  }

  downloadFile(data, filename, type) {
    const file = new Blob([data], {type: type})
    const a = document.createElement('a')
    const url = URL.createObjectURL(file)
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(function() {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 0)
  }

  render() {
    return (
      <div className={styles.container}>
        <Section title="Exportar ambiente" description="Exporta todo los datos de configuración">
          <Button onClick={this.generate}>Generar exportable</Button>
        </Section>
      </div>
    )
  }
}
