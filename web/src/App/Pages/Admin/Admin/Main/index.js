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

  renderRoleTitle(title) {
    return (
      <div>
        <Breadcrumbs>{title}</Breadcrumbs>
      </div>
    )
  }

  render() {
    const {roles} = this.props
    return (
      <div className={styles.container}>
        {roles.includes('superAdmin')
          ? this.renderRoleTitle('Super Admin')
          : this.renderRoleTitle('Admin')}
        <div className="divider" />
        <div className="row">
          {roles.includes('superAdmin')
            ? this.renderLinks(superAdminLinks)
            : this.renderLinks(adminLinks)}
        </div>
      </div>
    )
  }
}
