import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'

@withGraphQL(gql`
  query getForm($viewId: ID, $environmentId: ID) {
    view(viewId: $viewId) {
      _id
      name
      path
    }
    collections(environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
@withMessage
export default class View extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    view: PropTypes.object,
    collections: PropTypes.object
  }

  getFormTypes() {
    return [{label: 'Crear', value: 'create'}, {label: 'Actualizar', value: 'update'}]
  }

  render() {
    if (!this.props.view) return
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.view.name}</Breadcrumbs>
        <Section
          top
          title={`Editar vista ${this.props.view.name}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateView"
            ref="form"
            only="view"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              viewId: this.props.view._id,
              view: this.props.view
            }}
          />
          <br />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
        </Section>
      </div>
    )
  }
}
