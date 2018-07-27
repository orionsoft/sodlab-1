import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import MutationButton from 'App/components/MutationButton'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withRoles from 'App/helpers/auth/withRoles'
import {withRouter} from 'react-router'

@withMessage
@withRouter
@withRoles
export default class RemoveEnvironment extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    environmentId: PropTypes.string,
    roles: PropTypes.array
  }

  removeCollection() {
    this.props.showMessage('El ambiente fue eliminado')
    this.props.history.push('/admin/environments')
  }

  render() {
    const {roles, environmentId} = this.props
    if (!roles.includes('superAdmin')) return null
    return (
      <div className={styles.container}>
        <div className="divider" />
        <MutationButton
          label="Eliminar"
          title="¿Confirma que desea eliminar este ambiente?"
          confirmText="Confirmar"
          mutation="removeEnvironment"
          onSuccess={() => this.removeCollection()}
          params={{environmentId: environmentId}}
          danger
        />
      </div>
    )
  }
}
