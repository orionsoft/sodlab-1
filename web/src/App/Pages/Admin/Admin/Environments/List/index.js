import React from 'react'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Button from 'orionsoft-parts/lib/components/Button'
import PaginatedList from 'App/components/Crud/List'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'

@withRouter
export default class List extends React.Component {
  static propTypes = {
    history: PropTypes.object
  }

  render() {
    return (
      <div className={styles.container}>
        <Breadcrumbs
          past={{'/admin': 'Admin'}}
          right={<Button to="/admin/environments/create">Crear ambiente</Button>}>
          Ambientes
        </Breadcrumbs>
        <div className="divider" />
        <PaginatedList title={null} name="environments" canUpdate allowSearch basePath="" />
      </div>
    )
  }
}
