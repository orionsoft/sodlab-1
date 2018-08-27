import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Profile from './Profile'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import PropTypes from 'prop-types'
import Container from 'orionsoft-parts/lib/components/Container'
import Security from './Security'

export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div>
        <Container>
          <div className={styles.title}>
            <h1>Mi cuenta</h1>
          </div>
          <Tabs
            items={[
              {title: 'Perfil', path: '/settings'},
              {title: 'Seguridad', path: '/settings/security'}
            ]}
          />
          <div className="">
            <Switch>
              <Route exact path="/settings" component={Profile} />
              <Route path="/settings/security" component={Security} />
            </Switch>
          </div>
        </Container>
      </div>
    )
  }
}
