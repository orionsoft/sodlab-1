import React from 'react'
import styles from './styles.css'
import withEnvironmentUserId from 'App/helpers/auth/withEnvironmentUserId'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import MutationButton from 'App/components/MutationButton'

@withEnvironmentUserId
@withGraphQL(gql`
  query paginatedNotifications($environmentId: ID, $environmentUserId: ID) {
    notifications(environmentId: $environmentId, environmentUserId: $environmentUserId) {
      items {
        title
      }
    }
  }
`)
export default class NotificationIndicator extends React.Component {
  static propTypes = {
    environmentId: PropTypes.string,
    notifications: PropTypes.object,
    asd: PropTypes.string
  }

  render() {
    if (!this.props.environmentId || !this.props.notifications) return null
    console.log(this.props.notifications)
    const {notifications} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.divider} />
        {/* <MutationButton
          label="Descargar"
          title="¿Quieres descargar la información de esta tabla?"
          confirmText="Confirmar"
          mutation="exportTable"
          onSuccess={result => console.log('asd')}
          params={{
            tableId: 'asd'
          }}> */}
        {this.props.notifications.items.map(item => {
          return <div>{item.title}</div>
        })}
        {/* </MutationButton> */}
      </div>
    )
  }
}
