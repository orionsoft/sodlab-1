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

@withGraphQL(gql`
  query getChart($chartId: ID) {
    getChart(chartId: $chartId) {
      _id
      title
    }
  }
`)
@withMessage
export default class Chart extends React.Component {
  static propTypes = {
    getChart: PropTypes.object,
    showMessage: PropTypes.func
  }

  render() {
    if (!this.props.getChart) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.getChart.title}</Breadcrumbs>
        <Section
          top
          title={`Editar gráfico ${this.props.getChart.title}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit."
        >
          <AutoForm
            mutation="updateChart"
            ref="form"
            only="chart"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              chartId: this.props.getChart._id,
              chart: this.props.getChart
            }}
          />
          <br />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
        </Section>
      </div>
    )
  }
}
