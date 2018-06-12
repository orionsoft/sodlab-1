import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Navbar from './Navbar'
import {Route, Switch} from 'react-router-dom'
import Settings from './Settings'
import forceLogin from 'App/helpers/auth/forceLogin'
import DynamicComponent from 'App/components/DynamicComponent'

@forceLogin
export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div className={styles.container}>
        <Navbar />
        <Switch>
          <Route path="/settings" component={Settings} />
          <Route path="/admin" component={DynamicComponent(() => import('./Admin'))} />
        </Switch>
      </div>
    )
  }
}
