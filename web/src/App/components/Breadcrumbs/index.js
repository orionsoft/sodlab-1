import React from 'react'
import styles from './styles.css'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import RightIcon from 'react-icons/lib/md/keyboard-arrow-right'

export default class Breadcrumbs extends React.Component {
  static propTypes = {
    past: PropTypes.object,
    children: PropTypes.node,
    right: PropTypes.object
  }

  getPast() {
    return Object.keys(this.props.past).map(path => {
      const title = this.props.past[path]
      return {
        path,
        title
      }
    })
  }

  renderPast() {
    return this.getPast().map(item => {
      return (
        <span key={item.path}>
          <Link to={item.path}>{item.title}</Link>{' '}
          <span className="bread-divider">
            <RightIcon />
          </span>
        </span>
      )
    })
  }

  renderRight() {
    if (!this.props.right) return
    return <div className={styles.right}>{this.props.right}</div>
  }

  render() {
    return (
      <div>
        {this.renderRight()}
        <h1 className={styles.container}>
          {this.renderPast()}
          <span className="last">{this.props.children}</span>
        </h1>
      </div>
    )
  }
}
