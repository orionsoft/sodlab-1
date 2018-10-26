import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Profile from './Profile'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import PropTypes from 'prop-types'
import Container from 'orionsoft-parts/lib/components/Container'
import Security from './Security'
import withUserId from 'App/helpers/auth/withUserId'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

@withUserId
@withGraphQL(gql`
  query user($userId: ID) {
    user(userId: $userId) {
      email
    }
  }
`)
export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const {email} = this.props.user
    return (
      <div>
        <Container>
          <div className={styles.title}>
            <h1>Mi cuenta > {email}</h1>
          </div>
          {/* {title: 'Perfil', path: '/settings'}, */}
          <Tabs items={[{title: 'Seguridad', path: '/settings'}]} />
          <div className="">
            <Switch>
              {/* <Route exact path="/settings" component={Profile} /> */}
              <Route path="/settings" component={Security} />
            </Switch>
          </div>
        </Container>
      </div>
    )
  }
}
