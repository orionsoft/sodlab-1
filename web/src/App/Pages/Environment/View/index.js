import React from 'react'
import styles from './styles.css'
import Container from 'orionsoft-parts/lib/components/Container'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import {withApollo} from 'react-apollo'
import {FaArrowsAlt, FaClose} from 'react-icons/lib/fa'
import prependKey from 'App/helpers/misc/prependKey'
import autobind from 'autobind-decorator'
import Intercom from 'App/components/Intercom'
import Loadable from 'react-loadable'
import Loading from 'App/components/DynamicComponent/Loading'

function dynamicImport(loader, customProps) {
  return Loadable({
    loader,
    loading: Loading,
    render(loaded, props) {
      const Component = loaded.default
      return <Component {...props} {...customProps} />
    }
  })
}

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
      const Form = dynamicImport(() => import('./Form'), {...props, formId: item.formId})
      return (
        <div className={styles.item}>
          <Form />
        </div>
      )
    }
    if (item.type === 'table') {
      const Table = dynamicImport(() => import('./Table'), {...props, tableId: item.tableId})
      return (
        <div className={styles.item}>
          <Table />
        </div>
      )
    }
    if (item.type === 'indicator') {
      const Indicator = dynamicImport(() => import('./Indicator'), {
        ...props,
        indicatorId: item.indicatorId
      })
      return (
        <div className={styles.item}>
          <Indicator />
        </div>
      )
    }
    if (item.type === 'chart') {
      const Chart = dynamicImport(() => import('./Chart'), {...props, chartId: item.chartId})
      return (
        <div
          className={styles.item}
          // style fix needed to show the charts legends
          style={{padding: '0px 0px 20px 0px'}}>
          <Chart />
        </div>
      )
    }
    if (item.type === 'layout') {
      return this.renderItems(item.subItems, preIndex)
    }
    if (item.type === 'button') {
      const Button = dynamicImport(() => import('./Button'), {...props, buttonId: item.buttonId})
      return (
        <div className={styles.item}>
          <Button />
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
