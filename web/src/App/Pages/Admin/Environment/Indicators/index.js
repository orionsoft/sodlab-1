import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Create from './Create'
import Indicator from './Indicator'
import List from './List'

export default class Kpis extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/:environmentId/indicators" exact component={List} />
          <Route path="/:environmentId/indicators/create" component={Create} />
          <Route path="/:environmentId/indicators/:indicatorId" component={Indicator} />
        </Switch>
      </div>
    )
  }
}
