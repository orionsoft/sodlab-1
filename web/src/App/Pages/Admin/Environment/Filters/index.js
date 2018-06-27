import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import Create from './Create'
import List from './List'
import Filter from './Filter'

export default class Filters extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/:environmentId/filters" exact component={List} />
          <Route path="/:environmentId/filters/create" component={Create} />
          <Route path="/:environmentId/filters/:filterId" component={Filter} />
        </Switch>
      </div>
    )
  }
}
