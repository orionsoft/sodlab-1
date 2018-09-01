import React from 'react'
import PropTypes from 'prop-types'
import {FaSpinner} from 'react-icons/lib/fa'
import styles from './styles.css'

export default class DocumentEditorPagination extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    pagesSrc: PropTypes.array,
    activePage: PropTypes.number,
    changeState: PropTypes.func
  }

  handlePdfImagePageChange = e => {
    const activePage = parseInt(e.currentTarget.id.split('.')[2].replace('_', ''), 10)

    this.props.changeState({
      activePage
    })
  }

  renderPdfPagesRow = () => {
    return this.props.pagesSrc.map(image => {
      const page = image.name.split('.')[2].replace('_', '')
      const style =
        page === this.props.activePage.toString()
          ? {boxShadow: 'rgb(0,159,255) 0 0 1px 1px'}
          : {boxShadow: ''}

      return (
        <img
          key={image.name}
          id={image.name}
          src={image.src}
          alt=""
          style={style}
          onClick={this.handlePdfImagePageChange}
        />
      )
    })
  }

  render() {
    return (
      <div id="pdfPagesRowContainer" className={styles.pagesContainer}>
        {this.props.loading ? (
          <div className={styles.loaderContainer}>
            <FaSpinner className={styles.iconSpinMedium} />
          </div>
        ) : (
          this.renderPdfPagesRow()
        )}
      </div>
    )
  }
}
