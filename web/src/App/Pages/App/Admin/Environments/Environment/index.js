import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Main from './Main'

export default class Environment extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/admin/environments/:environmentId" exact component={Main} />
        </Switch>
      </div>
    )
  }
}
