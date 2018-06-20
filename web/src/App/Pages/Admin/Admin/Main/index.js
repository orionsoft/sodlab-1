import React from 'react'
import styles from './styles.css'
import links from '../links'
import {Link} from 'react-router-dom'
import Breadcrumbs from 'App/components/Breadcrumbs'

export default class Main extends React.Component {
  static propTypes = {}

  renderLinks() {
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

  render() {
    return (
      <div className={styles.container}>
        <Breadcrumbs>Admin</Breadcrumbs>
        <div className="divider" />
        <div className="row">{this.renderLinks()}</div>
      </div>
    )
  }
}