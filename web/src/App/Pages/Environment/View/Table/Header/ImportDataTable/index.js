import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import IconButton from 'orionsoft-parts/lib/components/IconButton'
import icons from 'App/components/Icon/icons'
import autobind from 'autobind-decorator'
import sleep from 'orionsoft-parts/lib/helpers/sleep'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import * as XLSX from 'xlsx'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import withModal from 'orionsoft-parts/lib/decorators/withModal'
import Loading from 'orionsoft-parts/lib/components/Loading'

@withMutation(gql`
  mutation importTable($collectionId: ID, $items: [JSON]) {
    importTable(collectionId: $collectionId, items: $items)
  }
`)
@withModal
@withMessage
export default class ImportDataTable extends React.Component {
  static propTypes = {
    showModal: PropTypes.func,
    showMessage: PropTypes.func,
    collectionId: PropTypes.string,
    importTable: PropTypes.func
  }

  state = {open: false}

  componentDidMount() {
    window.addEventListener('mouseup', this.closeMenu, false)
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.closeMenu)
  }

  @autobind
  async closeMenu(event) {
    if (!this.state.open) return true
    await sleep(100)
    this.setState({open: false})
  }

  @autobind
  toggleMenu() {
    this.setState({open: !this.state.open})
  }

  @autobind
  async importData(items) {
    const {collectionId} = this.props
    try {
      await this.props.importTable({collectionId, items})
      this.props.showMessage('Success')
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
      await this.importData(content)
    } catch (e) {
      this.props.showMessage('Error al leer el archivo')
    }
    this.setState({loading: false})
  }

  renderLoading() {
    return (
      <div className={styles.loading}>
        <Loading size={18} />
      </div>
    )
  }

  renderInput() {
    if (this.state.loading) return this.renderLoading()
    return (
      <div className={styles.menu} key="menu">
        <label htmlFor="file-upload">
          <IconButton icon={icons['MdFileUpload']} tooltip="Importar datos" size={18} />
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

  renderIcon() {
    return (
      <IconButton
        icon={icons['MdFileUpload']}
        tooltip="Importar datos"
        size={18}
        onPress={this.toggleMenu}
      />
    )
  }

  render() {
    console.log(this.state)
    return (
      <div className={styles.container}>
        {/* {this.renderIcon()}
        <ReactCSSTransitionGroup
          transitionName="user-menu"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}> */}
        {this.renderInput()}
        {/* </ReactCSSTransitionGroup> */}
      </div>
    )
  }
}
