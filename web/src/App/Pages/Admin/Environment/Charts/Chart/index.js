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
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import {Field, WithValue} from 'simple-react-form'
import ObjectField from 'App/components/fields/ObjectField'
import autobind from 'autobind-decorator'
import Option from '../../Hooks/Hook/Option'
import mapValues from 'lodash/mapValues'

@withGraphQL(gql`
  query chart($chartId: ID) {
    chart(chartId: $chartId) {
      _id
      title
      name
      environmentId
      chartTypeId
      options
    }
    chartTypes {
      value: _id
      label: name
      optionsParams
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
    match: PropTypes.object,
    chartTypes: PropTypes.array
  }

  remove() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Elemento eliminado satisfactoriamente!')
    this.props.history.push(`/${environmentId}/charts`)
  }

  getOptionsPreview(item) {
    return mapValues(mapValues(item.options, 'fixed'), 'value')
  }

  @autobind
  renderOptions(item) {
    if (!item.chartTypeId) return
    const chartType = this.props.chartTypes.find(f => f.value === item.chartTypeId)
    if (!chartType) return
    if (!chartType.optionsParams) return
    const fields = Object.keys(chartType.optionsParams).map(name => {
      const schema = chartType.optionsParams[name]
      return (
        <Option
          key={name}
          name={name}
          schema={schema}
          optionsPreview={this.getOptionsPreview(item)}
        />
      )
    })
    return (
      <div className={styles.options}>
        <Field fieldName="options" type={ObjectField}>
          {fields}
        </Field>
      </div>
    )
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
            }}>
            <Field fieldName="chart" type={ObjectField}>
              <div className="label">Nombre</div>
              <Field fieldName="name" type={Text} />
              <div className="label">Título</div>
              <Field fieldName="title" type={Text} />
              <div className="label">Gráfico</div>
              <Field fieldName="chartTypeId" type={Select} options={this.props.chartTypes} />
              <div className="divider" />
              <WithValue>{this.renderOptions}</WithValue>
            </Field>
          </AutoForm>
          <br />
          <Button to={`/${this.props.chart.environmentId}/charts`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <MutationButton
            label="Eliminar"
            title="Eliminar gráfico"
            message="¿Quieres eliminar este gráfico?"
            confirmText="Eliminar"
            mutation="removeChart"
            onSuccess={() => this.remove()}
            params={{chartId: this.props.chart._id}}
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
