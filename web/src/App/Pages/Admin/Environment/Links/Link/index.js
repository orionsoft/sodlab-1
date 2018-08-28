import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import ObjectField from 'App/components/fields/ObjectField'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import {Field} from 'simple-react-form'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import autobind from 'autobind-decorator'
import cloneDeep from 'lodash/cloneDeep'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'

@withGraphQL(gql`
  query getForm($linkId: ID, $environmentId: ID) {
    link(linkId: $linkId) {
      _id
      title
      roles
      fields {
        title
        path
      }
      environmentId
    }
    forms(limit: null, environmentId: $environmentId) {
      items {
        value: _id
        label: name
      }
    }
    roles(environmentId: $environmentId) {
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
    roles: PropTypes.object,
    match: PropTypes.object
  }

  @autobind
  onSuccess() {
    this.props.showMessage('Los campos fueron guardados')
  }

  @autobind
  removeLink() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('El link fue eliminado')
    this.props.history.push(`/${environmentId}/links`)
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
              link: cloneDeep(this.props.link)
            }}>
            <Field fieldName="link" type={ObjectField}>
              <div className="label">Título</div>
              <Field fieldName="title" type={Text} />
              <div className="label">Roles</div>
              <Field fieldName="roles" type={Select} multi options={this.props.roles.items} />
              <Field fieldName="fields" type={ArrayComponent}>
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-6">
                    <div className="label">Título</div>
                    <Field fieldName="title" type={Text} />
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-6">
                    <div className="label">Ruta</div>
                    <Field fieldName="path" type={Text} />
                  </div>
                </div>
              </Field>
            </Field>
          </AutoForm>
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button to={`/${this.props.link.environmentId}/links`} style={{marginRight: 10}}>
                Cancelar
              </Button>
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
            <div>
              <Button onClick={() => this.refs.form.submit()} primary>
                Guardar
              </Button>
            </div>
          </div>
        </Section>
      </div>
    )
  }
}
