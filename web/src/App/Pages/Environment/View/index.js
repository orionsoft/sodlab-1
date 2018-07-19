import React from 'react'
import styles from './styles.css'
import Container from 'orionsoft-parts/lib/components/Container'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Form from './Form'
import Table from './Table'
import {withApollo} from 'react-apollo'

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
      }
    }
    userByEnvironments(environmentId: $environmentId) {
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
    userByEnvironments: PropTypes.object
  }

  state = {}

  getParameters() {
    return {
      ...this.props.params,
      ...this.state,
      currentUser: this.props.userByEnvironments
        ? {
          id: this.props.userByEnvironments.userId,
          email: this.props.userByEnvironments.email,
          ...this.props.userByEnvironments.profile
        }
        : {profile: {}}
    }
  }

  renderItem(item) {
    const props = {
      routeParams: this.props.params,
      state: this.state,
      parameters: this.getParameters(),
      setEnvironment: changes => this.setState(changes)
    }
    if (item.type === 'form') {
      return <Form {...props} formId={item.formId} />
    }
    if (item.type === 'table') {
      return <Table {...props} tableId={item.tableId} />
    }
  }

  renderItems() {
    if (!this.props.view.items) return null
    return this.props.view.items.map((item, index) => {
      return (
        <div
          key={index}
          className={`col-xs-${item.sizeSmall} col-sm-${item.sizeMedium} col-md-${item.sizeLarge}`}>
          <div className={styles.item}>{this.renderItem(item)}</div>
        </div>
      )
    })
  }

  render() {
    const {view} = this.props
    return (
      <div className={styles.container}>
        <Container>
          <h1>{view.title}</h1>
          <div className="row">{this.renderItems()}</div>
        </Container>
      </div>
    )
  }
}
