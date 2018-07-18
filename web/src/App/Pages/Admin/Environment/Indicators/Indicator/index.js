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
import {Field} from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import ObjectField from 'App/components/fields/ObjectField'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'

@withGraphQL(gql`
  query indicator($indicatorId: ID, $environmentId: ID) {
    indicator(indicatorId: $indicatorId) {
      _id
      name
      title
      environmentId
      collectionId
      filtersIds
      allowsNoFilter
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
    filters: PropTypes.object
  }

  remove() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Elemento eliminado satisfactoriamente!')
    this.props.history.push(`/${environmentId}/indicators`)
  }

  getFilters() {
    return this.props.filters.items.filter(
      filter => filter.collectionId === this.props.indicator.collectionId
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
              indicator: this.props.indicator
            }}>
            <Field fieldName="indicator" type={ObjectField}>
              <div className="label">Nombre</div>
              <Field fieldName="name" type={Text} />
              <div className="label">Título</div>
              <Field fieldName="title" type={Text} />
              <div className="label">Filtros</div>
              <Field fieldName="filtersIds" type={Select} multi options={this.getFilters()} />
              <div className="label">Se puede usar sin filtro</div>
              <Field fieldName="allowsNoFilter" type={Checkbox} label="Se puede usar sin filtro" />
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
