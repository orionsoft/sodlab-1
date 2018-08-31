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
import {Field, WithValue} from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import ObjectField from 'App/components/fields/ObjectField'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import IndicatorOptions from './IndicatorOptions'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'
import FieldSelect from 'App/components/fieldTypes/collectionFieldSelect/Field'
import cloneDeep from 'lodash/cloneDeep'

@withGraphQL(gql`
  query indicator($indicatorId: ID, $environmentId: ID) {
    indicator(indicatorId: $indicatorId) {
      _id
      name
      title
      environmentId
      collectionId
      fieldName
      filtersIds
      filterByDefault
      allowsNoFilter
      indicatorTypeId
      options
      orderFiltersByName
    }
    indicatorTypes {
      value: _id
      label: name
      _id
      optionsParams
      requireCollection
      requireField
    }
    collections(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
    filters(environmentId: $environmentId) {
      items {
        value: _id
        label: name
        collectionId
      }
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
    match: PropTypes.object,
    filters: PropTypes.object,
    indicatorTypes: PropTypes.array,
    collections: PropTypes.object
  }

  remove() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Elemento eliminado satisfactoriamente!')
    this.props.history.push(`/${environmentId}/indicators`)
  }

  getFilters() {
    return this.props.filters.items.map(filter => {
      return {
        label: (
          <span>
            {filter.name} <span className={styles.filterCollection}>{filter.collection.name}</span>
          </span>
        ),
        value: filter._id
      }
    })
  }

  getSelectedFilters(thisIndicator) {
    return this.props.filters.items.filter(
      filter =>
        filter.collectionId === thisIndicator.collectionId &&
        thisIndicator.filtersIds &&
        thisIndicator.filtersIds.includes(filter.value)
    )
  }

  renderFilterOptions(indicator, indicatorType) {
    if (!indicator.collectionId) return
    const filters = this.props.filters.items.filter(
      filter => filter.collectionId === indicator.collectionId
    )
    return (
      <div style={{marginTop: 20}}>
        <div className="label">Filtros</div>
        <Field fieldName="filtersIds" type={Select} multi options={filters} />
        <div className="label">Filtro por defecto</div>
        <Field
          fieldName="filterByDefault"
          type={Select}
          options={this.getSelectedFilters(indicator)}
        />
        <div className="row">
          <div className="col-xs-6 col-sm-">
            <div className="label">Se puede usar sin filtro</div>
            <Field fieldName="allowsNoFilter" type={Checkbox} label="Se puede usar sin filtro" />
          </div>
          <div className="col-xs-6 col-sm-">
            <div className="label">Ordenar filtros alfabéticamente</div>
            <Field
              fieldName="orderFiltersByName"
              type={Checkbox}
              label="Ordenar filtros alfabéticamente"
            />
          </div>
        </div>
      </div>
    )
  }

  renderFieldOption(indicator, indicatorType) {
    if (!indicatorType.requireField) return
    if (!indicator.collectionId) return
    return (
      <div style={{marginTop: 20}}>
        <div className="label">Campo</div>
        <Field fieldName="fieldName" type={FieldSelect} collectionId={indicator.collectionId} />
      </div>
    )
  }

  renderIndicatorCollectionOptions(indicator, indicatorType) {
    if (!indicatorType.requireCollection) return
    return (
      <div style={{marginTop: 20}}>
        <div className="label">Colección</div>
        <Field fieldName="collectionId" type={Select} options={this.props.collections.items} />
        {this.renderFieldOption(indicator, indicatorType)}
        {this.renderFilterOptions(indicator, indicatorType)}
      </div>
    )
  }

  renderOptions(indicator) {
    const {indicatorTypeId} = indicator
    if (!indicatorTypeId) return
    const indicatorType = this.props.indicatorTypes.find(t => t._id === indicatorTypeId)
    if (!indicatorType) return
    return (
      <div className={styles.options}>
        {this.renderIndicatorCollectionOptions(indicator, indicatorType)}
        <IndicatorOptions indicatorType={indicatorType} type={indicatorTypeId} />
      </div>
    )
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
              indicator: cloneDeep(this.props.indicator)
            }}>
            <Field fieldName="indicator" type={ObjectField}>
              <div className="label">Nombre</div>
              <Field fieldName="name" type={Text} />
              <div className="label">Título</div>
              <Field fieldName="title" type={Text} />
              <div className="label">Indicador</div>
              <Field
                fieldName="indicatorTypeId"
                type={Select}
                options={this.props.indicatorTypes}
              />
              <WithValue>{indicator => this.renderOptions(indicator)}</WithValue>
            </Field>
          </AutoForm>
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
