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
        <Breadcrumbs>Crear colección</Breadcrumbs>
        <Section
          title="Crear colección"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top>
          <AutoForm
            mutation="createCollection"
            ref="form"
            omit="environmentId"
            doc={{environmentId}}
            onSuccess={col =>
              this.props.history.push(`/${environmentId}/collections/${col._id}`)
            }
          />
          <br />
          <Button to={`/${environmentId}/collections`} style={{marginRight: 10}}>
            Cancelar
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Crear colección
          </Button>
        </Section>
      </div>
    )
  }
}
