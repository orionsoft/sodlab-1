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
  query kpi($kpiId: ID) {
    kpi(kpiId: $kpiId) {
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
    kpi: PropTypes.object,
    showMessage: PropTypes.func,
    match: PropTypes.object
  }

  remove() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Elemento eliminado satisfactoriamente!')
    this.props.history.push(`/${environmentId}/kpis`)
  }

  render() {
    if (!this.props.kpi) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.kpi.title}</Breadcrumbs>
        <Section
          top
          title={`Editar kpi ${this.props.kpi.title}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateKpi"
            ref="form"
            only="kpi"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              kpiId: this.props.kpi._id,
              kpi: this.props.kpi
            }}
          />
          <br />
          <Button to={`/${this.props.kpi.environmentId}/kpis`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <MutationButton
            label="Eliminar"
            title="Eliminar kpi"
            message="¿Quieres eliminar este kpi?"
            confirmText="Eliminar"
            mutation="removeKpi"
            onSuccess={() => this.remove()}
            params={{kpiId: this.props.kpi._id}}
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
