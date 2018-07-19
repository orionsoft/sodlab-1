import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Profile from './Profile'
import Password from './Password'
import Tabs from 'orionsoft-parts/lib/components/Tabs'
import PropTypes from 'prop-types'
import Container from 'orionsoft-parts/lib/components/Container'

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
              {title: 'Contraseña', path: '/settings/password'}
            ]}
          />
          <div className="">
            <Switch>
              <Route exact path="/settings" component={Profile} />
              <Route path="/settings/password" component={Password} />
            </Switch>
          </div>
        </Container>
      </div>
    )
  }
}
