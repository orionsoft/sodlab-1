import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Profile from './Profile'
import Password from './Password'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import PropTypes from 'prop-types'
import Container from 'orionsoft-parts/lib/components/Container'
import Billing from './Billing'
import Credentials from './Credentials'

export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div>
        <Container>
          <h1>Settings</h1>
          <Tabs
            items={[
              {title: 'Profile', path: '/settings'},
              {title: 'Billing', path: '/settings/billing'},
              {title: 'Credentials', path: '/settings/credentials'},
              {title: 'Password', path: '/settings/password'}
            ]}
          />
          <div className="">
            <Switch>
              <Route exact path="/settings" component={Profile} />
              <Route path="/settings/billing" component={Billing} />
              <Route path="/settings/credentials" component={Credentials} />
              <Route path="/settings/password" component={Password} />
            </Switch>
          </div>
        </Container>
      </div>
    )
  }
}
