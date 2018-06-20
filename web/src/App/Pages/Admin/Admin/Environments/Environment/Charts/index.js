import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Create from './Create'
import Chart from './Chart'
import List from './List'

export default class Charts extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/admin/environments/:environmentId/charts" exact component={List} />
          <Route path="/admin/environments/:environmentId/charts/create" component={Create} />
          <Route path="/admin/environments/:environmentId/charts/:chartId" component={Chart} />
        </Switch>
      </div>
    )
  }
}
