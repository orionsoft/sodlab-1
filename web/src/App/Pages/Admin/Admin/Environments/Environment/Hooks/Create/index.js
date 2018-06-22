import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import {withRouter} from 'react-router'
import Breadcrumbs from '../../Breadcrumbs'

@withRouter
export default class Create extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs>Crear hook</Breadcrumbs>
        <Section
          title="Crear hook"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top>
          <AutoForm
            mutation="createHook"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={col => this.props.history.push(`/admin/environments/${environmentId}/hooks`)}
          />
          <br />
          <Button to={`/admin/environments/${environmentId}/hooks`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Crear hook
          </Button>
        </Section>
      </div>
    )
  }
}
