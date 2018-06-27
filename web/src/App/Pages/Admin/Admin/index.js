import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import DynamicComponent from 'App/components/DynamicComponent'
import links from './links'
import Container from 'orionsoft-parts/lib/components/Container'
import Navbar from '../Navbar'

export default class Admin extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Navbar />
        <Container>
          <Switch>
            <Route path="/admin" exact component={DynamicComponent(() => import('./Main'))} />
            {links.map(link => (
              <Route key={link.path} path={link.path} component={link.component} />
            ))}
          </Switch>
        </Container>
      </div>
    )
  }
}
