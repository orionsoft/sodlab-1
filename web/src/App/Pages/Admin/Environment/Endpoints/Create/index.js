import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'
import Breadcrumbs from '../../Breadcrumbs'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import {Field} from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'

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
export default class Create extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    collections: PropTypes.object
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs>Crear endpoint</Breadcrumbs>
        <Section title="Crear endpoint" description="Crear endpoint" top>
          <AutoForm
            mutation="createEndpoint"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={col => this.props.history.push(`/${environmentId}/endpoints/${col._id}`)}>
            <div className="label">Nombre</div>
            <Field fieldName="name" type={Text} />
            <div className="label">Identificador</div>
            <Field fieldName="identifier" type={Text} />
          </AutoForm>
          <br />
          <Button to={`/${environmentId}/endpoints`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Crear endpoint
          </Button>
        </Section>
      </div>
    )
  }
}
