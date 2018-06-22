import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import {withRouter} from 'react-router'

@withGraphQL(gql`
  query hook($hookId: ID) {
    hook(hookId: $hookId) {
      _id
      name
    }
  }
`)
@withRouter
@withMessage
export default class Hook extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    hook: PropTypes.object,
    showMessage: PropTypes.func,
    match: PropTypes.object
  }

  remove() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Elemento eliminado satisfactoriamente!')
    this.props.history.push(`/admin/environments/${environmentId}/hooks`)
  }

  render() {
    if (!this.props.hook) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.hook.name}</Breadcrumbs>
        <Section
          top
          title={`Editar hook ${this.props.hook.name}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateHook"
            ref="form"
            only="hook"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              hookId: this.props.hook._id,
              hook: this.props.hook
            }}
          />
          <br />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
          <MutationButton
            label="Eliminar"
            title="¿Confirma que desea eliminar este hook?"
            confirmText="Confirmar"
            mutation="removeHook"
            onSuccess={() => this.remove()}
            params={{hookId: this.props.hook._id}}
            danger
          />
        </Section>
      </div>
    )
  }
}
