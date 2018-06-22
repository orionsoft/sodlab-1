import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import {withRouter} from 'react-router'

@withGraphQL(gql`
  query design($designId: ID) {
    design(designId: $designId) {
      _id
      name
    }
  }
`)
@withRouter
@withMessage
export default class Design extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    design: PropTypes.object,
    showMessage: PropTypes.func,
    match: PropTypes.object
  }

  remove() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Elemento eliminado satisfactoriamente!')
    this.props.history.push(`/admin/environments/${environmentId}/designs`)
  }

  render() {
    if (!this.props.design) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.design.name}</Breadcrumbs>
        <Section
          top
          title={`Editar estilo ${this.props.design.name}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateDesign"
            ref="form"
            only="design"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              designId: this.props.design._id,
              design: this.props.design
            }}
          />
          <br />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
          <MutationButton
            label="Eliminar"
            title="¿Confirma que desea eliminar este estilo?"
            confirmText="Confirmar"
            mutation="removeDesign"
            onSuccess={() => this.remove()}
            params={{designId: this.props.design._id}}
            danger
          />
        </Section>
      </div>
    )
  }
}
