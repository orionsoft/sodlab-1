import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import Section from 'App/components/Section'
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
        <Breadcrumbs>Crear filtro</Breadcrumbs>
        <Section
          title="Crear filtro"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top
        >
          <AutoForm
            mutation="createFilter"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={col =>
              this.props.history.push(`/admin/environments/${environmentId}/filters`)
            }
          />
          <br />
          <Button to={`/admin/environments/${environmentId}/filters`} style={{marginRight: 10}}>
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
