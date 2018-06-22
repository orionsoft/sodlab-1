import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import {withRouter} from 'react-router'
import Breadcrumbs from '../../Breadcrumbs'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'

@withRouter
@withMessage
export default class Create extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    match: PropTypes.object
  }

  success(environmentId) {
    this.props.showMessage('Elemento creado satisfactoriamente!')
    this.props.history.push(`/admin/environments/${environmentId}/designs`)
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs>Crear estilo</Breadcrumbs>
        <Section
          title="Crear estilo"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top>
          <AutoForm
            mutation="createDesign"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={() => this.success(environmentId)}
          />
          <br />
          <Button to={`/admin/environments/${environmentId}/designs`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Crear estilo
          </Button>
        </Section>
      </div>
    )
  }
}
