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
import MutationButton from 'App/components/MutationButton'
import autobind from 'autobind-decorator'

@withGraphQL(gql`
  query getForm($linkId: ID, $environmentId: ID) {
    link(linkId: $linkId) {
      _id
      path
      title
    }
    forms(limit: null, environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
  }
`)
@withMessage
export default class Link extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    history: PropTypes.object,
    link: PropTypes.object,
    collections: PropTypes.object,
    forms: PropTypes.object,
    match: PropTypes.object
  }

  @autobind
  onSuccess() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('Los campos fueron guardados')
    this.props.history.push(`/admin/environments/${environmentId}/links`)
  }

  @autobind
  removeLink() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('El link fue eliminado')
    this.props.history.push(`/admin/environments/${environmentId}/links`)
  }

  render() {
    if (!this.props.link) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.link.title}</Breadcrumbs>
        <Section
          top
          title={`Editar link ${this.props.link.title}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateLink"
            ref="form"
            only="link"
            onSuccess={this.onSuccess}
            doc={{
              linkId: this.props.link._id,
              link: this.props.link
            }}
          />
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button onClick={() => this.refs.form.submit()} primary>
                Guardar
              </Button>
            </div>
            <div>
              <MutationButton
                label="Eliminar"
                title="¿Confirma que desea eliminar este link?"
                confirmText="Confirmar"
                mutation="removeLink"
                onSuccess={this.removeLink}
                params={{linkId: this.props.link._id}}
                danger
              />
            </div>
          </div>
        </Section>
      </div>
    )
  }
}
