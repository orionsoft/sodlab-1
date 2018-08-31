import React from 'react'
import styles from './styles.css'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import withRoles from 'App/helpers/auth/withRoles'
import AutoForm from 'App/components/AutoForm'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withRoles
@withRouter
@withMessage
export default class List extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    roles: PropTypes.array
  }

  render() {
    if (!this.props.roles.includes('superAdmin')) {
      this.props.showMessage('No tienes permisos para crear ambientes')
      this.props.history.push('/admin/environments')
    }
    return (
      <div className={styles.container}>
        <Breadcrumbs past={{'/admin': 'Admin', '/admin/environments': 'Ambientes'}}>
          Crear un nuevo ambiente
        </Breadcrumbs>
        <div className="divider" />
        <Section
          title="Crear ambiente"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top>
          <AutoForm
            mutation="createEnvironment"
            ref="form"
            onSuccess={env => this.props.history.push(`/${env._id}`)}
          />
          <br />
          <Button to="/admin/environments" style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Crear ambiente
          </Button>
        </Section>
      </div>
    )
  }
}
