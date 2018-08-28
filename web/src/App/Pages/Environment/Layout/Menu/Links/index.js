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

  renderLink({title, path}, useFullToCheck) {
    const active = useFullToCheck
      ? this.props.location.pathname === path
      : this.props.location.pathname.startsWith(path)
    return (
      <Link key={path} to={path} className={active ? styles.itemActive : styles.subMenuItem}>
        {title}
      </Link>
    )
  }

  @autobind
  show() {
    this.setState({show: !this.state.show})
  }

  render() {
    const {link} = this.props
    if (!link) return null
    return (
      <div className={styles.container} onClick={this.show}>
        <div className={styles.menuItem}>{link.title}</div>
        <ReactCSSTransitionGroup
          transitionName="sub-menu"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}>
          {this.state.show && (
            <div className={styles.showItems}>
              {link.fields.map(field => {
                return this.renderLink(field, true)
              })}
            </div>
          )}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}
