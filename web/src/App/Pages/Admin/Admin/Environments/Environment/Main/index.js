import React from 'react'
import styles from './styles.css'
import Breadcrumbs from '../Breadcrumbs'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import {withRouter} from 'react-router'
import autobind from 'autobind-decorator'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withRouter
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
      url
    }
  }
`)
@withMessage
export default class Main extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    environment: PropTypes.object
  }

  @autobind
  goToEnv() {
    window.open('http://' + this.props.environment.url)
  }

  @autobind
  removeEnvironment() {
    this.props.showMessage('La vista fue eliminada')
    this.props.history.push(`/admin/environments`)
  }

  render() {
    if (!this.props.environment) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs />
        <div className={styles.buttonContainer}>
          <div>
            <Button onClick={this.goToEnv}>Ir al Ambiente</Button>
          </div>
          <div>
            <MutationButton
              label="Eliminar"
              title="¿Confirma que desea eliminar esta vista?"
              confirmText="Confirmar"
              mutation="removeEnvironment"
              onSuccess={this.removeEnvironment}
              params={{environmentId: this.props.environment._id}}
              danger
            />
          </div>
        </div>
      </div>
    )
  }
}
