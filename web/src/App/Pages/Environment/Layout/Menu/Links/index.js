import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router'
import autobind from 'autobind-decorator'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

@withRouter
export default class Menu extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    link: PropTypes.object
  }

  state = {show: false}

  renderLink({title, path}, isPath) {
    const active = this.props.location.pathname === path
    const style = isPath ? 'menuItem' : 'subMenuItem'
    const styleActive = isPath ? 'itemActive' : 'subItemActive'
    return (
      <Link key={path} to={path} className={active ? styles[styleActive] : styles[style]}>
        {title}
      </Link>
    )
  }

  @autobind
  show() {
    this.setState({show: !this.state.show})
  }

  renderCategory(link) {
    return (
      <div>
        <div className={styles.menuItem}>{link.title}</div>
        <ReactCSSTransitionGroup
          transitionName="sub-menu"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}>
          {this.state.show && (
            <div className={styles.showItems}>
              {link.fields.map(field => {
                return this.renderLink(field)
              })}
            </div>
          )}
        </ReactCSSTransitionGroup>
      </div>
    )
  }

  renderByType(link) {
    if (link.type === 'path') return this.renderLink(link, true)
    if (link.type === 'category') return this.renderCategory(link)
  }

  render() {
    const {link} = this.props
    if (!link) return null
    return (
      <div className={styles.container} onClick={this.show}>
        {this.renderByType(link)}
      </div>
    )
  }
}
