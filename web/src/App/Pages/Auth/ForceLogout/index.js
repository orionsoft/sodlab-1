import React from 'react'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'
import logout from 'App/helpers/auth/logout'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'

@withRouter
export default class Logout extends React.Component {
  static propTypes = {
    history: PropTypes.object
  }

  async logout() {
    await logout()
  }

  render() {
    return (
      <div className={styles.container}>
        <p>This account doesn't have permissions, please log out.</p>
        <Button onClick={this.logout} danger>
          Sign out
        </Button>
      </div>
    )
  }
}
