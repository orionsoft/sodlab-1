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

@withUserId
export default class Login extends React.Component {
  static propTypes = {
    onLogin: PropTypes.func,
    userId: PropTypes.string
  }

  @autobind
  onSuccess({userId, publicKey, secretKey}) {
    localStorage.setItem('session.userId', userId)
    localStorage.setItem('session.publicKey', publicKey)
    localStorage.setItem('session.secretKey', secretKey)
    this.props.onLogin()
  }

  render() {
    if (this.props.userId) return <LoggedIn />
    return (
      <div>
        <AutoForm mutation="loginWithPassword" ref="form" onSuccess={this.onSuccess}>
          <div className="label">Email</div>
          <Field fieldName="email" type={Text} placeholder="Email" />
          <div className="label">Password</div>
          <Field fieldName="password" type={Text} fieldType="password" placeholder="Password" />
          <div className="description">
            <Link to="/forgot">Forgot my password</Link>
          </div>
        </AutoForm>
        <br />
        <Button onClick={() => this.refs.form.submit()} primary>
          Login
        </Button>
        <br />
        <br />
        <div>
          If you don{"'"}t have an account, <Link to="/register">Register</Link>
        </div>
      </div>
    )
  }
}
