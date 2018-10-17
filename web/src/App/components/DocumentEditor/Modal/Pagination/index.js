import React from 'react'
import PropTypes from 'prop-types'
import {FaSpinner} from 'react-icons/lib/fa'
import autobind from 'autobind-decorator'
import styles from './styles.css'

export default class DocumentEditorPagination extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    pagesSrc: PropTypes.array,
    activePage: PropTypes.number,
    changeState: PropTypes.func
  }

  @autobind
  handlePdfImagePageChange(e) {
    const activePage = parseInt(e.currentTarget.id.split('.')[2].replace('_', ''), 10)

    this.props.changeState({
      activePage
    })
  }

  @autobind
  renderPdfPagesRow() {
    return this.props.pagesSrc.sort((a, b) => a.index - b.index).map(page => {
      const currentPage = page.name.split('.')[2].replace('_', '')
      const style =
        currentPage === this.props.activePage.toString()
          ? {boxShadow: 'rgb(0,159,255) 0 0 1px 1px'}
          : {boxShadow: ''}

      return (
        <img
          key={page.name}
          id={page.name}
          src={page.src}
          alt={page.name}
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
