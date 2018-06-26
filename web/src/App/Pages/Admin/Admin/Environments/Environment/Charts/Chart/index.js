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
  query chart($chartId: ID) {
    chart(chartId: $chartId) {
      _id
      title
    }
  }
`)
@withRouter
@withMessage
export default class Chart extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    chart: PropTypes.object,
    showMessage: PropTypes.func,
    match: PropTypes.object
  }

  remove() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Elemento eliminado satisfactoriamente!')
    this.props.history.push(`/admin/environments/${environmentId}/charts`)
  }

  render() {
    if (!this.props.chart) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.chart.title}</Breadcrumbs>
        <Section
          top
          title={`Editar gráfico ${this.props.chart.title}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateChart"
            ref="form"
            only="chart"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              chartId: this.props.chart._id,
              chart: this.props.chart
            }}
          />
          <br />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
          <MutationButton
            label="Eliminar"
            title="¿Confirma que desea eliminar este gráfico?"
            confirmText="Confirmar"
            mutation="removeChart"
            onSuccess={() => this.remove()}
            params={{chartId: this.props.chart._id}}
            danger
          />
        </Section>
      </div>
    )
  }
}
