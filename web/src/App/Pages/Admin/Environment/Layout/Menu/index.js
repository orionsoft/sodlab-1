import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import BackIcon from 'react-icons/lib/md/arrow-back'
import OpenIcon from 'react-icons/lib/md/open-in-new'
import {withRouter} from 'react-router'
import CloseIcon from 'react-icons/lib/md/close'

@withRouter
export default class Menu extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
    environment: PropTypes.object,
    links: PropTypes.array,
    toggleMenu: PropTypes.func
  }

  renderLink({title, path}) {
    const pathname = this.props.location.pathname
    const linkPath = `/${this.props.environment._id}${path}`
    const useFullToCheck = path === '/'
    const active = useFullToCheck ? pathname === linkPath : pathname.startsWith(linkPath)
    return (
      <Link key={path} to={linkPath} className={active ? styles.itemActive : styles.menuItem}>
        {title}
      </Link>
    )
  }

  renderLinks() {
    return (this.props.links || []).map(link => {
      return this.renderLink(link)
    })
  }

  toggleMenu = e => {
    e.preventDefault()
    this.props.toggleMenu()
  }

  render() {
    const {environment} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.menuButton}>
          <CloseIcon onClick={this.toggleMenu} />
        </div>
        {environment.logo ? (
          <div
            style={{
              backgroundImage: `url(${environment.logo.url})`,
              backgroundSize: '100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              height: '80px'
            }}
          />
        ) : (
          <Link to={`/${this.props.environment._id}`} className={styles.title}>
            {environment.name}
          </Link>
        )}

        <div className={styles.dividerLogo} />
        {this.renderLinks()}
        <div className={styles.divider} />
        <div
          className={styles.logout}
          onClick={() => window.open('http://' + this.props.environment.url)}>
          <OpenIcon />
          <span style={{marginLeft: 5}}>Ir al ambiente</span>
        </div>
        <div
          className={styles.logout}
          onClick={() => this.props.history.push('/admin/environments')}>
          <BackIcon />
          <span style={{marginLeft: 5}}>Volver</span>
        </div>
      </div>
    )
  }
}
