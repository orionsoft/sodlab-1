import React from 'react'
import styles from './styles.css'
import CloseIcon from 'react-icons/lib/md/close'
import IconButton from 'orionsoft-parts/lib/components/IconButton'
import PropTypes from 'prop-types'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Upload from './Upload'
import Files from './Files'
import autobind from 'autobind-decorator'

export default class Manager extends React.Component {
  static propTypes = {
    close: PropTypes.func,
    onChange: PropTypes.func
  }

  @autobind
  selectFile(fileId) {
    this.props.onChange({_id: fileId})
    this.props.close()
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.title}>Archivos</div>
            <div className={styles.close}>
              <IconButton tooltip="Cerrar" icon={CloseIcon} onPress={this.props.close} />
            </div>
          </div>
          <div className={styles.header2}>
            <div className={styles.search}>
              <Text placeholder="Buscar archivos..." />
            </div>
          </div>
          <Files selectFile={this.selectFile} />
          <Upload />
        </div>
      </div>
    )
  }
}
