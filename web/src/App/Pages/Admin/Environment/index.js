import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import {Route, Switch} from 'react-router-dom'
import {withRouter} from 'react-router'
import Collections from './Collections'
import Main from './Main'
import Forms from './Forms'
import Configuration from './Configuration'
import Views from './Views'
import Links from './Links/index'
import Tables from './Tables'
import Roles from './Roles'
import Layout from './Layout'
import Charts from './Charts'
import Filters from './Filters'
import Hooks from './Hooks'
import EnvironmentUsers from './EnvironmentUsers'
import Indicators from './Indicators'
import Endpoints from './Endpoints'
import Validations from './Validations'
import Buttons from './Buttons'

@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
      url
    }
  }
`)
@withRouter
export default class Environment extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    environment: PropTypes.object
  }

  componentDidMount() {
    const {environment} = this.props
    document.title = `Admin | ${environment.name}`
  }

  render() {
    const {environment} = this.props
    if (!environment) return null
    return (
      <div className={styles.container}>
        <Layout environment={this.props.environment}>
          <Switch>
            <Route path="/:environmentId" exact component={Main} />
            <Route path="/:environmentId/collections" component={Collections} />
            <Route path="/:environmentId/charts" component={Charts} />
            <Route path="/:environmentId/filters" component={Filters} />
            <Route path="/:environmentId/hooks" component={Hooks} />
            <Route path="/:environmentId/forms" component={Forms} />
            <Route path="/:environmentId/views" component={Views} />
            <Route path="/:environmentId/links" component={Links} />
            <Route path="/:environmentId/tables" component={Tables} />
            <Route path="/:environmentId/roles" component={Roles} />
            <Route path="/:environmentId/indicators" component={Indicators} />
            <Route path="/:environmentId/configuration" component={Configuration} />
            <Route path="/:environmentId/users" component={EnvironmentUsers} />
            <Route path="/:environmentId/endpoints" component={Endpoints} />
            <Route path="/:environmentId/validations" component={Validations} />
            <Route path="/:environmentId/buttons" component={Buttons} />
          </Switch>
        </Layout>
      </div>
    )
  }
}
