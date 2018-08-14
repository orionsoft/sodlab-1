import React from 'react'
import styles from './styles.css'
import {Route, Switch} from 'react-router-dom'
import List from './List'
import Create from './Create'
import Validation from './Validation'

export default class Views extends React.Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.container}>
        <Switch>
          <Route path="/:environmentId/validations" exact component={List} />
          <Route path="/:environmentId/validations/create" component={Create} />
          <Route path="/:environmentId/validations/:validationId" component={Validation} />
        </Switch>
      </div>
    )
  }
}
