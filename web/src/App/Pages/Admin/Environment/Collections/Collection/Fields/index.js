import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import cloneDeep from 'lodash/cloneDeep'
import autobind from 'autobind-decorator'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import {Field} from 'simple-react-form'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import FieldTypeOptions from 'App/components/FieldTypeOptions'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'
import translate from 'App/i18n/translate'

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
export default class Fields extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    collection: PropTypes.object,
    params: PropTypes.object,
    fieldTypes: PropTypes.object
  }

  static fragment = gql`
    fragment adminCollectionFieldsUpdateFragment on Collection {
      _id
      fields {
        name
        type
        label
        options
        optional
      }
    }
  `

  state = {}

  componentDidMount() {
    this.setState({fields: this.props.collection.fields || []})
  }

  static getDerivedStateFromProps(props, state) {
    return {
      fields: props.collection.fields || []
    }
  }

  @autobind
  onSuccess() {
    this.props.showMessage('Los campos fueron guardados')
  }

  getErrorFieldLabel() {
    return translate('general.thisField')
  }

  @autobind
  renderItems(field) {
    return (
      <div className="row">
        <div className="col-xs-6 col-md-3">
          <div className="label">ID</div>
          <Field fieldName="name" type={Text} />
        </div>
        <div className="col-xs-6 col-md-3">
          <div className="label">Nombre</div>
          <Field fieldName="label" type={Text} />
        </div>
        <div className="col-xs-8 col-md-4">
          <div className="label">Tipo</div>
          <Field fieldName="type" type={Select} options={this.getFieldTypes()} />
        </div>
        <div className="col-xs-4 col-md-2">
          <div className="label">Opcional</div>
          <Field fieldName="optional" type={Checkbox} label="Opcional" />
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

  getFieldTypes() {
    return cloneDeep(this.props.fieldTypes).sort((a, b) => (a.label > b.label ? 1 : -1))
  }

  @autobind
  toggleOptionals() {
    const prevOptionalToggleValue = !!this.state.optionalToggleValue
    this.setState(prevState => ({optionalToggleValue: !prevState.optionalToggleValue}))
    const arrayFields = this.refs.form.form.state.value
      ? this.refs.form.form.state.value.fields
      : this.state.fields
    const fields = arrayFields.map(field => {
      return {
        ...(field.name && {name: field.name}),
        ...(field.label && {label: field.label}),
        ...(field.type && {type: field.type}),
        optional: !prevOptionalToggleValue,
        ...(field.options && {options: field.options})
      }
    })
    this.setState({fields})
  }

  render() {
    if (!this.props.collection) return null
    const {collection} = this.props
    return (
      <div className={styles.container}>
        <Section
          top
          title="Campos"
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="setCollectionFields"
            ref="form"
            fragment={Fields.fragment}
            onSuccess={this.onSuccess}
            getErrorFieldLabel={this.getErrorFieldLabel}
            doc={{
              collectionId: this.props.collection._id,
              fields: cloneDeep(this.state.fields) || cloneDeep(collection.fields) || []
            }}>
            <Field fieldName="fields" type={ArrayComponent} renderItem={this.renderItems} />
          </AutoForm>
          <br />
          <div className={styles.buttonContainer}>
            <div>
              <Button onClick={this.toggleOptionals}>Cambiar Opcionales</Button>
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
