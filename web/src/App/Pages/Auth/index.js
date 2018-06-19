import React from 'react'
import styles from './styles.css'
import Logo from './Logo'
import autobind from 'autobind-decorator'
import PropTypes from 'prop-types'
import Login from './Login'
import Register from './Register'
import VerifyEmail from './VerifyEmail'
import Forgot from './Forgot'
import Reset from './Reset'
import Enroll from './Enroll'
import {Route, Switch, withRouter} from 'react-router-dom'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import withEnvironmentId from 'App/helpers/environment/withEnvironmentId'

@withEnvironmentId
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
      logo {
        url
      }
      authBackgroundImage {
        url
      }
    }
  }
`)
@withRouter
export default class Auth extends React.Component {
  state = {isLoading: false, error: null}

  static propTypes = {
    children: PropTypes.any,
    location: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    params: PropTypes.object,
    environment: PropTypes.object
  }

  @autobind
  onLogin() {
    const {location} = this.props
    if (location.state && location.state.nextPathname) {
      this.props.history.replace(location.state.nextPathname)
    } else {
      this.props.history.replace('/')
    }
  }

  getBackgroundImage() {
    const {environment} = this.props
    if (environment && environment.authBackgroundImage) {
      return environment.authBackgroundImage.url
    }
    return 'https://images.unsplash.com/photo-1496096265110-f83ad7f96608?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=35840c5a386390076c95d47b745ae459&auto=format&fit=crop&w=2850&q=80'
  }

  renderLogo() {
    const src = this.props.environment ? this.props.environment.logo.url : '/dark.svg'
    return (
      <div className={styles.logo}>
        <Logo color="black" src={src} isLoading={this.state.isLoading} />
      </div>
    )
  }

  renderName() {
    const name = this.props.environment ? this.props.environment.name : 'Sodlab'
    return <div className={styles.name}>{name}</div>
  }

  render() {
    const otherProps = {onLogin: this.onLogin}
    return (
      <div className={styles.container} style={{minHeight: window.innerHeight}}>
        <div className={styles.content}>
          {this.renderLogo()}
          <Switch>
            <Route path="/login" render={() => <Login {...otherProps} />} />
            <Route path="/register" render={() => <Register {...otherProps} />} />
            <Route
              path="/verify-email/:token"
              render={({match}) => <VerifyEmail token={match.params.token} {...otherProps} />}
            />
            <Route path="/forgot" render={() => <Forgot {...otherProps} />} />
            <Route
              path="/reset/:token"
              render={({match}) => <Reset token={match.params.token} {...otherProps} />}
            />
            <Route
              path="/enroll/:token"
              render={({match}) => <Enroll token={match.params.token} {...otherProps} />}
            />
          </Switch>
        </div>
        <div
          className={styles.photo}
          style={{backgroundImage: `url(${this.getBackgroundImage()})`}}
        />
      </div>
    )
  }
}
