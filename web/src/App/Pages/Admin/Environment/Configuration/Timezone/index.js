import React from 'react'
import styles from './styles.css'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import {Field} from 'simple-react-form'
import ObjectField from 'App/components/fields/ObjectField'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'

@withMessage
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      timezone
    }
  }
`)
export default class Timezone extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    environment: PropTypes.object
  }

  // get TZ values from https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  // and check that they are available en moment-timezone package (in the backend)
  getTimezoneOptions() {
    return [
      {label: 'Chile - Santiago', value: 'America/Santiago'},
      {label: 'Chile - Punta Arenas', value: 'America/Punta_Arenas'},
      {label: 'Chile - Isla de Pascua', value: 'Pacific/Easter'},
      {label: 'Argentina - Buenos Aires', value: 'America/Argentina/Buenos_Aires'},
      {label: 'Francia - Paris', value: 'Europe/Paris'},
      {label: 'Perú - Lima', value: 'America/Lima'}
    ].sort((a, b) => {
      if (a.label.toLowerCase() < b.label.toLowerCase()) return -1
      if (a.label.toLowerCase() > b.label.toLowerCase()) return 1
      return 0
    })
  }

  render() {
    return (
      <div className={styles.container}>
        <Section
          title="Zona Horaria"
          description="Elegir la zona horaria que manejará el servidor"
          top>
          <AutoForm
            mutation="setEnvironmentTimezone"
            onSuccess={() => this.props.showMessage('Zona horaria guardada')}
            ref="form"
            only="environment"
            doc={{
              environmentId: this.props.environment._id,
              environment: this.props.environment
            }}>
            <Field fieldName="environment" type={ObjectField}>
              <Field fieldName="timezone" type={Select} options={this.getTimezoneOptions()} />
            </Field>
          </AutoForm>
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
        </Section>
      </div>
    )
  }
}
