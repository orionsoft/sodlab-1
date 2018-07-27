import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import AutoForm from 'App/components/AutoForm'
import Breadcrumbs from 'App/components/Breadcrumbs'
import Button from 'orionsoft-parts/lib/components/Button'
import Section from 'App/components/Section'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import {Field} from 'simple-react-form'
import cloneDeep from 'lodash/cloneDeep'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import {withRouter} from 'react-router'

@withGraphQL(gql`
  query getUser($userId: ID) {
    user(userId: $userId) {
      _id
      email
      environmentsAuthorized
    }
    environments {
      items {
        value: _id
        label: name
      }
    }
  }
`)
@withMessage
@withRouter
export default class User extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    user: PropTypes.object,
    environments: PropTypes.object
  }

  onSuccess() {
    this.props.showMessage('Los ambientes fueron guardados')
    this.props.history.push('/admin/users')
  }

  render() {
    const {user, environments} = this.props
    return (
      <div className={styles.container}>
        <Breadcrumbs past={{'/admin/users': 'Super Admin'}}>Edición de usuario</Breadcrumbs>
        <Section
          top
          title={`Editar usuario ${user.email}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <br />
          <AutoForm
            mutation="setUserEnvironments"
            ref="form"
            only="environmentsAuthorized"
            onSuccess={() => this.onSuccess()}
            doc={{
              userId: user._id,
              environmentsAuthorized: cloneDeep(user.environmentsAuthorized)
            }}>
            <div className="label">Ambientes autorizados para el usuario</div>
            <Field
              fieldName="environmentsAuthorized"
              type={Select}
              multi
              options={environments.items}
            />
          </AutoForm>
          <div className={styles.buttonContainer}>
            <div>
              <Button to={`/admin/users`} style={{marginRight: 10}}>
                Cancelar
              </Button>
            </div>
            <div>
              <Button onClick={() => this.refs.form.submit()} primary>
                Guardar
              </Button>
            </div>
          </div>
        </Section>
      </div>
    )
  }
}
