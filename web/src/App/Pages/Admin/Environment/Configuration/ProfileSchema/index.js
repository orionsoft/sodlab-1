import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import Button from 'orionsoft-parts/lib/components/Button'
import {Field} from 'simple-react-form'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import clone from 'lodash/clone'
import {withRouter} from 'react-router'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import autobind from 'autobind-decorator'
import FieldTypeOptions from 'App/components/FieldTypeOptions'

@withRouter
@withMessage
@withGraphQL(gql`
  query getFieldTypes {
    fieldTypes {
      value: _id
      label: name
      _id
      name
      optionsParams
    }
  }
`)
export default class ProfileSchema extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    environment: PropTypes.object,
    history: PropTypes.object,
    fieldTypes: PropTypes.object
  }

  static fragment = gql`
    fragment adminEnvironmentProfilesUpdateFragment on Environment {
      _id
      profileSchema {
        name
        type
        label
        options
      }
    }
  `
  @autobind
  onSuccess() {
    this.props.showMessage('Los campos fueron guardados')
  }

  getErrorFieldLabel() {
    return 'Este campo'
  }

  @autobind
  renderItems(field) {
    return (
      <div className="row">
        <div className="col-xs-6 col-md-4">
          <div className="label">ID</div>
          <Field fieldName="name" type={Text} />
        </div>
        <div className="col-xs-6 col-md-4">
          <div className="label">Nombre</div>
          <Field fieldName="label" type={Text} />
        </div>
        <div className="col-xs-12 col-md-4">
          <div className="label">Tipo</div>
          <Field fieldName="type" type={Select} options={this.props.fieldTypes} />
        </div>
        <div className="col-xs-12">
          {field.type ? (
            <FieldTypeOptions
              fieldType={this.props.fieldTypes.find(t => t._id === field.type)}
              type={field.type}
            />
          ) : null}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <Section
          top
          title="Perfil"
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="setEnvironmentProfileSchema"
            ref="form"
            fragment={ProfileSchema.fragment}
            onSuccess={this.onSuccess}
            onChange={this.onChange}
            getErrorFieldLabel={this.getErrorFieldLabel}
            doc={{
              environmentId: this.props.environment._id,
              profileSchema: clone(this.props.environment.profileSchema)
            }}>
            <Field fieldName="profileSchema" type={ArrayComponent} renderItem={this.renderItems} />
          </AutoForm>
          <br />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
        </Section>
      </div>
    )
  }
}
