import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Create from './Create'
import Button from './Button'
import List from './List'

export default class Kpis extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/:environmentId/buttons" exact component={List} />
          <Route path="/:environmentId/buttons/create" component={Create} />
          <Route path="/:environmentId/buttons/:buttonId" component={Button} />
        </Switch>
      </div>
    )
  }
}
