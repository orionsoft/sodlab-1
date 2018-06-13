import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import List from './List'
import Create from './Create'
import Form from './Form'

export default class Forms extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/admin/environments/:environmentId/forms" exact component={List} />
          <Route path="/admin/environments/:environmentId/forms/create" component={Create} />
          <Route path="/admin/environments/:environmentId/forms/:formId" component={Form} />
        </Switch>
      </div>
    )
  }
}
