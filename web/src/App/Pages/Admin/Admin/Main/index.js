import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import {superAdminLinks, adminLinks} from '../links'
import {Link} from 'react-router-dom'
import Breadcrumbs from 'App/components/Breadcrumbs'
import withRoles from 'App/helpers/auth/withRoles'

@withRoles
export default class Main extends React.Component {
  static propTypes = {
    roles: PropTypes.array
  }

  renderLinks(links) {
    return links.map(link => {
      return (
        <div className="col-xs-12 col-sm-3" key={link.path}>
          <Link
            to={link.path}
            className={styles.link}
            style={{backgroundImage: `url(${link.image})`}}>
            <div className={styles.title}>{link.title}</div>
          </Link>
        </div>
      )
    })
  }

  renderRoleTitle() {
    if (this.props.roles.includes('superAdmin')) {
      return <div className={styles.title}>Super Admin</div>
    }
    return (
      <div className={styles.title}>
        <div className={styles.title}>Admin</div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.renderRoleTitle()}</Breadcrumbs>
        <div className="divider" />
        <div className="row">
          {this.props.roles.includes('superAdmin')
            ? this.renderLinks(superAdminLinks)
            : this.renderLinks(adminLinks)}
        </div>
      </div>
    )
  }
}
