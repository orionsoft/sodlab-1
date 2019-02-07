import React from 'react'
import styles from './styles.css'
import Container from 'orionsoft-parts/lib/components/Container'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Form from './Form'
import Table from './Table'
import Indicator from './Indicator'
import Button from './Button'
import {withApollo} from 'react-apollo'
import {FaArrowsAlt, FaClose} from 'react-icons/lib/fa'
import prependKey from 'App/helpers/misc/prependKey'
import autobind from 'autobind-decorator'
import Intercom from 'App/components/Intercom'
import Chart from './Chart'

@withGraphQL(
  gql`
    query getView($viewId: ID, $environmentId: ID) {
      view(viewId: $viewId, environmentId: $environmentId) {
        _id
        title
        intercom
        titleColor
        items {
          sizeSmall
          sizeLarge
          sizeMedium
          type
          formId
          tableId
          chartId
          indicatorId
          fullSize
          subItems
          buttonId
        }
      }
      userByEnvironment(environmentId: $environmentId) {
        userId
        email
        profile
      }
    }
  `,
  {
    options: {fetchPolicy: 'network-only'}
  }
)
@withApollo
export default class View extends React.Component {
  static propTypes = {
    client: PropTypes.object,
    params: PropTypes.object,
    view: PropTypes.object,
    environmentId: PropTypes.string,
    intercomId: PropTypes.string,
    userByEnvironment: PropTypes.object,
    timezone: PropTypes.string
  }

  state = {fullSize: false, key: null}

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

  renderItem(item, fullSize, preIndex) {
    const timezone = this.props.timezone ? this.props.timezone : 'America/Santiago'
    const props = {
      routeParams: this.props.params,
      state: this.state,
      parameters: this.getParameters(),
      timezone,
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
          <Indicator {...props} indicatorId={item.indicatorId} fullSize={fullSize} />
        </div>
      )
    }
    if (item.type === 'chart') {
      return (
        <div
          className={styles.item}
          // style fix needed to show the charts legends
          style={{padding: '0px 0px 20px 0px'}}>
          <Chart {...props} chartId={item.chartId} fullSize={fullSize} />
        </div>
      )
    }
    if (item.type === 'layout') {
      return this.renderItems(item.subItems, preIndex)
    }
    if (item.type === 'button') {
      return (
        <div className={styles.item}>
          <Button {...props} buttonId={item.buttonId} />
        </div>
      )
    }
  }

  @autobind
  fullScreen(key) {
    this.setState({fullSize: !this.state.fullSize, key})
  }

  renderFullSize(key) {
    return this.state.fullSize ? (
      <FaClose onClick={() => this.fullScreen(key)} style={{cursor: 'pointer'}} />
    ) : (
      <FaArrowsAlt onClick={() => this.fullScreen(key)} style={{cursor: 'pointer'}} />
    )
  }

  @autobind
  renderButtons(item, key) {
    const fullSize = item.type !== 'layout' && item.fullSize
    return (
      <div className={`row end-xs ${styles.buttons}`}>{fullSize && this.renderFullSize(key)}</div>
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

  renderItems(items, preIndex) {
    if (!items) return null
    const views = items.map((item, index) => {
      let key = preIndex ? preIndex + '-' + index.toString() : index.toString()
      return (
        <div
          key={index}
          className={
            this.state.fullSize && this.state.key === key
              ? styles.fullSize
              : `col-xs-${item.sizeSmall} col-sm-${item.sizeMedium} col-md-${item.sizeLarge}`
          }>
          <div className={styles.itemContainer}>
            {this.renderButtons(item, key)}
            {this.renderItem(item, this.state.fullSize, key)}
          </div>
        </div>
      )
    })
    return <div className="row">{views}</div>
  }

  render() {
    const {view, intercomId, userByEnvironment} = this.props
    return (
      <div className={styles.container}>
        {this.renderFullSizeStyles()}
        <Container>
          <h1 style={{color: view.titleColor}}>{view.title && view.title}</h1>
          {this.renderItems(view.items)}
          {view.intercom && <Intercom intercomId={intercomId} email={userByEnvironment.email} />}
        </Container>
      </div>
    )
  }
}
