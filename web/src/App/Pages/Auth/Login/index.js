import React from 'react'
import AutoForm from 'App/components/AutoForm'
import {Field} from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Button from 'orionsoft-parts/lib/components/Button'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import withUserId from 'App/helpers/auth/withUserId'
import LoggedIn from '../LoggedIn'
import {Link} from 'react-router-dom'
import {setSession} from '@orion-js/graphql-client'

@withUserId
export default class Login extends React.Component {
  static propTypes = {
    onLogin: PropTypes.func,
    userId: PropTypes.string,
    loading: PropTypes.bool
  }

  @autobind
  async onSuccess(session) {
    await setSession(session)
    this.props.onLogin()
  }

  render() {
    if (!this.props.loading && this.props.userId) return <LoggedIn />
    return (
      <div>
        <AutoForm mutation="loginWithPassword" ref="form" onSuccess={this.onSuccess}>
          <div className="label">Email</div>
          <Field fieldName="email" type={Text} placeholder="Email" />
          <div className="label">Contraseña</div>
          <Field fieldName="password" type={Text} fieldType="password" placeholder="Contraseña" />
          <div className="description">
            <Link to="/forgot">Olvidé mi contraseña</Link>
          </div>
        </AutoForm>
        <br />
        <Button onClick={() => this.refs.form.submit()} primary loading={this.props.loading}>
          Entrar
        </Button>
      </div>
    )
  }
}
