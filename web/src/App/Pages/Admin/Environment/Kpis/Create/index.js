import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
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
    this.props.history.push(`/${environmentId}/kpis`)
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs>Crear kpi</Breadcrumbs>
        <Section
          title="Crear kpi"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top>
          <AutoForm
            mutation="createKpi"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={() => this.success(environmentId)}
          />
          <br />
          <Button to={`/${environmentId}/kpis`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Crear kpi
          </Button>
        </Section>
      </div>
    )
  }
}
