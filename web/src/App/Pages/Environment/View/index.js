import React from 'react'
import styles from './styles.css'
import Container from 'orionsoft-parts/lib/components/Container'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Form from './Form'
import Table from './Table'
import Indicator from './Indicator'
import {withApollo} from 'react-apollo'
import prependKey from 'App/helpers/misc/prependKey'

@withGraphQL(gql`
  query getView($viewId: ID, $environmentId: ID) {
    view(viewId: $viewId) {
      _id
      title
      items {
        sizeSmall
        sizeLarge
        sizeMedium
        type
        formId
        tableId
        indicatorId
        subItems
      }
    }
    userByEnvironment(environmentId: $environmentId) {
      userId
      email
      profile
    }
  }
`)
@withApollo
export default class View extends React.Component {
  static propTypes = {
    client: PropTypes.object,
    params: PropTypes.object,
    view: PropTypes.object,
    environmentId: PropTypes.string,
    userByEnvironment: PropTypes.object
  }

  state = {}

  getUserParams() {
    const user = this.props.userByEnvironment
    if (!user) return {}
    const data = {
      id: user.userId,
      email: user.email,
      ...user.profile
    }

    return prependKey(data, 'user', '_')
  }

  getParameters() {
    const parameters = {
      ...this.getUserParams(),
      ...this.props.params,
      ...this.state
    }
    return parameters
  }

  renderItem(item) {
    const props = {
      routeParams: this.props.params,
      state: this.state,
      parameters: this.getParameters(),
      setEnvironment: changes => this.setState(changes)
    }
    if (item.type === 'form') {
      return (
        <div className={styles.item}>
          <Form {...props} formId={item.formId} />
        </div>
      )
    }
    if (item.type === 'table') {
      return (
        <div className={styles.item}>
          <Table {...props} tableId={item.tableId} />
        </div>
      )
    }
    if (item.type === 'indicator') {
      return (
        <div className={styles.item}>
          <Indicator {...props} indicatorId={item.indicatorId} />
        </div>
      )
    }
    if (item.type === 'layout') {
      return this.renderItems(item.subItems)
    }
  }

  renderItems(items) {
    if (!items) return null
    const views = items.map((item, index) => {
      return (
        <div
          key={index}
          className={`col-xs-${item.sizeSmall} col-sm-${item.sizeMedium} col-md-${item.sizeLarge}`}>
          {this.renderItem(item)}
        </div>
      )
    })
    return <div className="row">{views}</div>
  }

  render() {
    const {view} = this.props
    return (
      <div className={styles.container}>
        <Container>
          <h1>{view.title}</h1>
          {this.renderItems(this.props.view.items)}
        </Container>
      </div>
    )
  }
}
