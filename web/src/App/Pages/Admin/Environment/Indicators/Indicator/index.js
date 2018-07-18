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
  query indicator($indicatorId: ID) {
    indicator(indicatorId: $indicatorId) {
      _id
      name
      title
      environmentId
    }
  }
`)
@withRouter
@withMessage
export default class Kpi extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    indicator: PropTypes.object,
    showMessage: PropTypes.func,
    match: PropTypes.object
  }

  remove() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Elemento eliminado satisfactoriamente!')
    this.props.history.push(`/${environmentId}/indicators`)
  }

  render() {
    if (!this.props.indicator) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.indicator.title}</Breadcrumbs>
        <Section
          top
          title={`Editar indicador ${this.props.indicator.title}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateIndicator"
            ref="form"
            only="indicator"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              indicatorId: this.props.indicator._id,
              indicator: this.props.indicator
            }}
          />
          <br />
          <Button
            to={`/${this.props.indicator.environmentId}/indicators`}
            style={{marginRight: 10}}>
            Cancelar
          </Button>
          <MutationButton
            label="Eliminar"
            title="Eliminar indicador"
            message="¿Quieres eliminar este indicador?"
            confirmText="Eliminar"
            mutation="deleteIndicator"
            onSuccess={() => this.remove()}
            params={{indicatorId: this.props.indicator._id}}
            danger
          />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
        </Section>
      </div>
    )
  }
}
