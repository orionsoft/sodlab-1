import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import File from './File'

@withGraphQL(gql`
  query getFiles($filter: String) {
    files: fileManagerFiles(page: 1, limit: 200, filter: $filter) {
      items {
        _id
        genericType
        name
        url
        type
        size
        key
        bucket
        status
        createdBy
        ...fileManagerFile
      }
    }
  }
  ${File.fragment}
`)
export default class Files extends React.Component {
  static propTypes = {
    files: PropTypes.object,
    selectFile: PropTypes.func,
    filter: PropTypes.string
  }

  renderNoFiles() {
    return <div>Aún no hay archivos</div>
  }

  renderFiles() {
    if (!this.props.files.items) return this.renderNoFiles()
    return this.props.files.items.map(file => {
      return (
        <div key={file._id} className="col-xs-6 col-sm-3 col-md-2">
          <File file={file} select={() => this.props.selectFile(file._id)} />
        </div>
      )
    })
  }

  render() {
    return (
      <div className={styles.container}>
        <div className="row">{this.renderFiles()}</div>
      </div>
    )
  }
}
