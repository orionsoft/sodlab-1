import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import {Field, WithValue} from 'simple-react-form'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'
import Breadcrumbs from '../../Breadcrumbs'

@withGraphQL(gql`
  query getCollections($environmentId: ID) {
    collections(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
@withRouter
export default class List extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    collections: PropTypes.object
  }

  getFormTypes() {
    return [{label: 'Crear', value: 'create'}, {label: 'Editar', value: 'update'}]
  }

  renderUpdateOptions(form) {
    return (
      <div style={{marginTop: 15}}>
        <div className="label">Nombre de la variable</div>
        <Field fieldName="updateVariableName" type={Text} />
      </div>
    )
  }

  renderExtraOptions(form) {
    if (form.type === 'update') return this.renderUpdateOptions(form)
    return null
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs>Crear formulario</Breadcrumbs>
        <Section
          title="Crear formulario"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top>
          <AutoForm
            mutation="createForm"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={col => this.props.history.push(`/${environmentId}/forms/${col._id}`)}>
            <div className="label">Nombre</div>
            <Field fieldName="name" type={Text} />
            <div className="label">Título</div>
            <Field fieldName="title" type={Text} />
            <div className="label">Tipo</div>
            <Field fieldName="type" type={Select} options={this.getFormTypes()} />
            <div className="label">Colección</div>
            <Field fieldName="collectionId" type={Select} options={this.props.collections.items} />
            <WithValue>{form => this.renderExtraOptions(form)}</WithValue>
          </AutoForm>
          <br />
          <Button to={`/${environmentId}/forms`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Crear formulario
          </Button>
        </Section>
      </div>
    )
  }
}
