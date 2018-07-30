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
import {FaArrowsAlt, FaClose} from 'react-icons/lib/fa'
import prependKey from 'App/helpers/misc/prependKey'
import autobind from 'autobind-decorator'

@withGraphQL(gql`
  query getView($viewId: ID, $environmentId: ID) {
    view(viewId: $viewId) {
      _id
      title
      fullSize
      items {
        sizeSmall
        sizeLarge
        sizeMedium
        type
        formId
        tableId
        indicatorId
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

  state = {fullSize: false, index: null}

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

  renderItem(item, fullSize) {
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
    if (item.type === 'indicator') {
      return <Indicator {...props} indicatorId={item.indicatorId} fullSize={fullSize} />
    }
  }

  @autobind
  fullScreen(index) {
    this.setState({fullSize: !this.state.fullSize, index})
  }

  renderFullSize(index) {
    return this.state.fullSize ? (
      <FaClose onClick={() => this.fullScreen(index)} style={{cursor: 'pointer'}} />
    ) : (
      <FaArrowsAlt onClick={() => this.fullScreen(index)} style={{cursor: 'pointer'}} />
    )
  }

  @autobind
  renderButtons(index, event) {
    const {view} = this.props
    return (
      <div className={`row end-xs ${styles.buttons}`}>
        {view.fullSize && this.renderFullSize(index)}
      </div>
    )
  }

  renderFullSizeStyles() {
    if (!this.state.fullSize) return null
    return (
      <style jsx="true">{`
        body {
          position: fixed;
          overflow: hidden;
        }
      `}</style>
    )
  }

  renderItems() {
    if (!this.props.view.items) return null
    return this.props.view.items.map((item, index) => {
      return (
        <div
          className={
            this.state.fullSize && index === this.state.index
              ? styles.fullSize
              : `col-xs-${item.sizeSmall} col-sm-${item.sizeMedium} col-md-${item.sizeLarge}`
          }>
          <div className={styles.item}>
            {this.renderButtons(index)}
            {this.renderItem(item, this.state.fullSize)}
          </div>
        </div>
      )
    })
  }

  render() {
    const {view} = this.props
    return (
      <div className={styles.container}>
        {this.renderFullSizeStyles()}
        <Container>
          <h1>{view.title}</h1>
          <div className="row">{this.renderItems()}</div>
        </Container>
      </div>
    )
  }
}
