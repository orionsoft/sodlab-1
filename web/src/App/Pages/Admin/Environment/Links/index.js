import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import List from './List'
import Create from './Create'
import Link from './Link'

export default class Views extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/:environmentId/links" exact component={List} />
          <Route path="/:environmentId/links/create" component={Create} />
          <Route path="/:environmentId/links/:linkId" component={Link} />
        </Switch>
      </div>
    )
  }
}
