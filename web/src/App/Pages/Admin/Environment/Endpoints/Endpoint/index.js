import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import {Field} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import ObjectField from 'App/components/fields/ObjectField'
import autobind from 'autobind-decorator'
import cloneDeep from 'lodash/cloneDeep'
import translate from 'App/i18n/translate'

@withGraphQL(gql`
  query getEndpoint($endpointId: ID, $environmentId: ID) {
    endpoint(endpointId: $endpointId) {
      _id
      identifier
      name
      environmentId
      collectionId
      filterId
      password
      collection {
        _id
        environmentId
        fields {
          value: name
          label
        }
      }
    }
    filters(environmentId: $environmentId) {
      items {
        value: _id
        label: name
        collectionId
      }
    }
    collections(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
@withMessage
export default class Link extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    collections: PropTypes.object,
    history: PropTypes.object,
    endpoint: PropTypes.object,
    forms: PropTypes.object,
    match: PropTypes.object,
    filters: PropTypes.object
  }

  state = {}

  getFilters() {
    return this.props.filters.items.filter(
      filter => filter.collectionId === this.props.endpoint.collectionId
    )
  }

  getErrorFieldLabel() {
    return translate('general.thisField')
  }

  @autobind
  onRemoveEndpoint() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('El endpoint fue eliminado')
    this.props.history.push(`/${environmentId}/endpoints`)
  }

  @autobind
  onSuccess() {
    this.props.showMessage('Los campos fueron guardados')
  }

  renderCollection() {
    const {endpoint, collections} = this.props
    const data = collections.items.find(collection => {
      return endpoint.collectionId === collection.value
    })
    return <div className={styles.name}>{data.label}</div>
  }

  render() {
    if (!this.props.endpoint) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.endpoint.title}</Breadcrumbs>
        <Section
          top
          title={`Editar endpoint`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateEndpoint"
            getErrorFieldLabel={this.getErrorFieldLabel}
            ref="form"
            onSuccess={this.onSuccess}
            doc={{
              endpointId: this.props.endpoint._id,
              endpoint: cloneDeep(this.props.endpoint) || {}
            }}>
            <Field fieldName="endpoint" type={ObjectField}>
              <div className="label">Nombre</div>
              <Field fieldName="name" type={Text} />
              <div className="label">Password</div>
              <Field fieldName="password" type={Text} />
              <div className="label">Identificador</div>
              <Field fieldName="identifier" type={Text} />
              <div className="label">Colección (No se puede cambiar)</div>
              {this.renderCollection()}
              <div className="label">Filtro</div>
              <Field fieldName="filterId" type={Select} options={this.getFilters()} />
            </Field>
          </AutoForm>
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button
                to={`/${this.props.endpoint.environmentId}/endpoints`}
                style={{marginRight: 10}}>
                Cancelar
              </Button>
              <MutationButton
                label="Eliminar"
                title="Eliminar endpoint"
                message="¿Quieres eliminar este endpoint?"
                confirmText="Confirmar"
                mutation="removeEndpoint"
                onSuccess={this.onRemoveEndpoint}
                params={{endpointId: this.props.endpoint._id}}
                danger
              />
            </div>
            <div>
              <Button onClick={() => this.refs.form.submit()} primary>
                Guardar
              </Button>
            </div>
          </div>
        </Section>
      </div>
    )
  }
}
