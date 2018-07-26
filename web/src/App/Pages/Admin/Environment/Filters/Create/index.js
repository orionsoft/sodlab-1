import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import Section from 'App/components/Section'
import {withRouter} from 'react-router'
import Breadcrumbs from '../../Breadcrumbs'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import {Field} from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'

@withRouter
@withMessage
@withGraphQL(gql`
  query getForm($environmentId: ID) {
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

  @autobind
  onSuccess(filter) {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Elemento creado satisfactoriamente!')
    this.props.history.push(`/${environmentId}/filters/${filter._id}`)
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs>Crear filtro</Breadcrumbs>
        <Section
          title="Crear filtro"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top>
          <AutoForm
            mutation="createFilter"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={this.onSuccess}>
            <div className="label">Nombre</div>
            <Field fieldName="name" type={Text} />
            <div className="label">Title</div>
            <Field fieldName="title" type={Text} />
            <div className="label">Colección</div>
            <Field fieldName="collectionId" type={Select} options={this.props.collections.items} />
          </AutoForm>
          <br />
          <Button to={`/${environmentId}/filters`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Crear filtro
          </Button>
        </Section>
      </div>
    )
  }
}
