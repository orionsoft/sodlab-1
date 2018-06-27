import React from 'react'
import styles from './styles.css'
import Container from 'orionsoft-parts/lib/components/Container'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Form from './Form'
import Table from './Table'

@withGraphQL(gql`
  query getView($viewId: ID) {
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
  }
`)
export default class View extends React.Component {
  static propTypes = {
    params: PropTypes.object,
    view: PropTypes.object
  }

  renderItem(item) {
    if (item.type === 'form') {
      return <Form formId={item.formId} routeParams={this.props.params} />
    }
    if (item.type === 'table') {
      return <Table tableId={item.tableId} routeParams={this.props.params} />
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
