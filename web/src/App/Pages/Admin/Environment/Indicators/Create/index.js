import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import {withRouter} from 'react-router'
import Breadcrumbs from '../../Breadcrumbs'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import {Field} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

@withRouter
@withMessage
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
export default class Create extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    match: PropTypes.object,
    collections: PropTypes.object
  }

  success(environmentId) {
    this.props.showMessage('Indicador creado satisfactoriamente!')
    this.props.history.push(`/${environmentId}/indicators`)
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs>Crear Indicador</Breadcrumbs>
        <Section
          title="Crear indicador"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top>
          <AutoForm
            mutation="createIndicator"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={() => this.success(environmentId)}>
            <div className="label">Nombre</div>
            <Field fieldName="name" type={Text} />
            <div className="label">Título</div>
            <Field fieldName="title" type={Text} />
            <div className="label">Colección</div>
            <Field fieldName="collectionId" type={Select} options={this.props.collections.items} />
          </AutoForm>
          <br />
          <Button to={`/${environmentId}/indicators`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Crear indicador
          </Button>
        </Section>
      </div>
    )
  }
}
