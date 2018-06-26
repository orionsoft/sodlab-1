import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'
import Breadcrumbs from '../../Breadcrumbs'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withRouter
@withMessage
export default class List extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    match: PropTypes.object
  }

  onSuccess(environmentId) {
    this.props.showMessage('Elemento creado satisfactoriamente!')
    this.props.history.push(`/admin/environments/${environmentId}/roles`)
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs>Crear rol</Breadcrumbs>
        <Section
          title="Crear rol"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top>
          <AutoForm
            mutation="createRole"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={() => this.onSuccess(environmentId)}
          />
          <br />
          <Button to={`/admin/environments/${environmentId}/roles`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Crear rol
          </Button>
        </Section>
      </div>
    )
  }
}
