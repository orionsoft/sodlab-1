import React from 'react'
import styles from './styles.css'
import autobind from 'autobind-decorator'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import fetch from 'unfetch'
import mime from 'mime-types'

@withMutation(gql`
  mutation generateUploadCredentials($name: String, $size: Float, $type: String) {
    result: generateUploadCredentials(name: $name, size: $size, type: $type) {
      fileId
      url
      fields
      key
    }
  }
`)
@withMutation(gql`
  mutation completeUpload($fileId: ID) {
    completeUpload(fileId: $fileId) {
      _id
    }
  }
`)
@withMessage
export default class Upload extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    generateUploadCredentials: PropTypes.func,
    completeUpload: PropTypes.func
  }

  state = {}

  @autobind
  async onChange(event) {
    const file = this.refs.input.files[0]
    this.setState({loading: true})
    try {
      const credentials = await this.requestCredentials(file)
      await this.uploadFile(credentials, file)
      await this.complete(credentials.fileId)
      this.setState({loading: false})
    } catch (error) {
      this.props.showMessage(error)
      this.setState({loading: false})
    }
  }

  @autobind
  async requestCredentials(file) {
    const {result} = await this.props.generateUploadCredentials({
      name: file.name,
      size: file.size,
      type: file.type || mime.lookup(file.name) || 'application/octet-stream'
    })
    return result
  }

  async uploadFile({fields, key, url}, file) {
    var formData = new FormData()
    const data = {
      ...fields,
      key: key,
      file: file
    }

    for (const name in data) {
      formData.append(name, data[name])
    }

    await fetch(url, {
      method: 'POST',
      body: formData
    })
  }

  @autobind
  async complete(fileId) {
    await this.props.completeUpload({fileId})
    this.props.showMessage('El archivo se cargó correctamente')
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

  renderLoading() {
    if (!this.state.loading) return
    return <div className={styles.loading}>Subiendo archivo...</div>
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderLoading()}
        {this.renderInput()}
      </div>
    )
  }
}
