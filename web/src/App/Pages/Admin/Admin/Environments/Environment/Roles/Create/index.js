import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'
import Breadcrumbs from '../../Breadcrumbs'

@withRouter
export default class List extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object
  }

  render() {
    const {environmentId} = this.props.match.params
    return (
      <div className={styles.container}>
        <Breadcrumbs>Crear Rol</Breadcrumbs>
        <Section
          title="Crear rol"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top
        >
          <AutoForm
            mutation="createRole"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={col =>
              this.props.history.push(
                `/admin/environments/${environmentId}/roles/${col._id}`
              )
            }
          />
          <br />
          <Button
            to={`/admin/environments/${environmentId}/roles`}
            style={{marginRight: 10}}
          >
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
