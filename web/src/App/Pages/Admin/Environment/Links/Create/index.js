import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import {withRouter} from 'react-router'
import PropTypes from 'prop-types'
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
        <Breadcrumbs>Crear Link</Breadcrumbs>
        <Section
          title="Crear link"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top>
          <AutoForm
            mutation="createLink"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={col =>
              this.props.history.push(`/${environmentId}/links/${col._id}`)
            }
          />
          <br />
          <Button to={`/${environmentId}/links`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Crear link
          </Button>
        </Section>
      </div>
    )
  }
}
