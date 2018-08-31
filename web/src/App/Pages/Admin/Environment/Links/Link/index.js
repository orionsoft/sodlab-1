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
import {Field, WithValue} from 'simple-react-form'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import autobind from 'autobind-decorator'
import cloneDeep from 'lodash/cloneDeep'
import LinkOptions from './LinkOptions'
import NumberField from 'orionsoft-parts/lib/components/fields/numeral/Number'
import range from 'lodash/range'
import iconOptions from 'App/components/Icon/options'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'

@withGraphQL(gql`
  query getForm($linkId: ID, $environmentId: ID) {
    link(linkId: $linkId) {
      _id
      title
      path
      roles
      type
      icon
      position
      showInHome
      sizeSmall
      sizeMedium
      sizeLarge
      fields {
        title
        path
        icon
        showInHome
        sizeSmall
        sizeMedium
        sizeLarge
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

  renderLinkOptions() {
    return <WithValue>{link => <LinkOptions link={link} />}</WithValue>
  }

  renderTypes() {
    const typeOptions = [{value: 'path', label: 'Ruta'}, {value: 'category', label: 'Categoría'}]
    return (
      <div>
        <Field fieldName="type" type={Select} options={typeOptions} />
        {this.renderLinkOptions()}
      </div>
    )
  }

  getSizeOptions() {
    return range(12).map(index => ({label: `${12 - index}/12`, value: String(12 - index)}))
  }

  renderCardOptions(link) {
    if (!link.showInHome) return null
    return (
      <div>
        <div className="label">Tamaño Tarjeta</div>
        <div className="row">
          <div className="col-xs-12 col-sm-4">
            <div className="label">Columnas Móvil</div>
            <Field fieldName="sizeSmall" type={Select} options={this.getSizeOptions()} />
          </div>
          <div className="col-xs-12 col-sm-4">
            <div className="label">Columnas Mediano</div>
            <Field fieldName="sizeMedium" type={Select} options={this.getSizeOptions()} />
          </div>
          <div className="col-xs-12 col-sm-4">
            <div className="label">Columnas Largo</div>
            <Field fieldName="sizeLarge" type={Select} options={this.getSizeOptions()} />
          </div>
        </div>
      </div>
    )
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
              <div className="label">Icono</div>
              <Field fieldName="icon" type={Select} options={iconOptions} />
              <div className="label">Posición</div>
              <Field fieldName="position" type={NumberField} />
              <div className="label">Tipo</div>
              {this.renderTypes()}
              <div className="divider" />
              <WithValue>
                {link =>
                  link.type === 'path' && (
                    <div>
                      <div className="label">Mostrar en home</div>
                      <Field fieldName="showInHome" type={Checkbox} label="Mostrar en home" />
                      {this.renderCardOptions(link)}
                    </div>
                  )
                }
              </WithValue>
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
