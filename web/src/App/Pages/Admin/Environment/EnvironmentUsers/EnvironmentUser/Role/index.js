import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import {Field} from 'simple-react-form'
import Button from 'orionsoft-parts/lib/components/Button'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import clone from 'lodash/clone'

@withMessage
@withGraphQL(gql`
  query getRoles($environmentId: ID) {
    roles(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
export default class Role extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    environmentUser: PropTypes.object,
    roles: PropTypes.object
  }

  static fragment = gql`
    fragment adminEnvironmentUserRoleFragment on EnvironmentUser {
      _id
      roles
    }
  `

  getRoles() {
    return this.props.roles.items
  }

  render() {
    if (!this.props.environmentUser || !this.props.roles) return null
    return (
      <div className={styles.container}>
        <Section
          top
          title="Roles"
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="setEnvironmentUserRoles"
            ref="form"
            fragment={Role.fragment}
            onSuccess={() => this.props.showMessage('Los roles fueron guardados')}
            doc={{
              environmentUserId: this.props.environmentUser._id,
              roles: clone(this.props.environmentUser.roles)
            }}>
            <Field fieldName="roles" multi type={Select} options={this.getRoles()} />
          </AutoForm>
          <br />
          <div style={{textAlign: 'right'}}>
            <Button onClick={() => this.refs.form.submit()} primary>
              Guardar
            </Button>
          </div>
        </Section>
      </div>
    )
  }
}
