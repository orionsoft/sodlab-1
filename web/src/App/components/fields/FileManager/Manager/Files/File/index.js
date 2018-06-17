import React from 'react'
import styles from './styles.css'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import PDFIcon from 'react-icons/lib/md/picture-as-pdf'
import UnknownIcon from 'react-icons/lib/md/description'

const iconMap = {
  pdf: PDFIcon,
  unknown: UnknownIcon
}

export default class File extends React.Component {
  static fragment = gql`
    fragment fileManagerFile on File {
      _id
      genericType
      name
      url
      type
      size
      status
      createdBy
    }
  `

  static propTypes = {
    file: PropTypes.object,
    select: PropTypes.func
  }

  renderImagePreview() {
    const {url} = this.props.file
    return (
      <div
        className={styles.imagePreview}
        style={{backgroundImage: `url("${url}")`}}
        alt="Image preview"
      />
    )
  }

  renderPreview() {
    if (this.props.file.genericType === 'image') return this.renderImagePreview()
    const Icon = iconMap[this.props.file.genericType]
    return (
      <div className={styles.preview}>
        <Icon size={60} />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container} onClick={this.props.select}>
        {this.renderPreview()}
        <div className={styles.name}>{this.props.file.name}</div>
      </div>
    )
  }
}
