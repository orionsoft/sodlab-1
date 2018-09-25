import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import {Field} from 'simple-react-form'
import PropTypes from 'prop-types'
import fieldTypes from 'App/components/fieldTypes'

@withGraphQL(gql`
  query getCollectionFields($collectionId: ID) {
    collection(collectionId: $collectionId) {
      _id
      fields {
        name
        type
        options
      }
    }
  }
`)
export default class CollectionFieldSelect extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    environmentId: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    collection: PropTypes.object,
    field: PropTypes.string,
    errorMessage: PropTypes.node,
    passProps: PropTypes.object
  }

  render() {
    if (!this.props.collection) return 'collectionNotFound'
    if (!this.props.field) return 'fieldNotFound'

    const {field, collection} = this.props

    const collectionField = collection.fields.find(cf => cf.name === field)
    if (!collectionField) return 'fieldNotFound'
    const FieldComponent = fieldTypes[collectionField.type].field
    return (
      <div className={styles.fixedValue}>
        <Field
          value={this.props.value}
          onChange={this.props.onChange}
          collectionFieldName={
            (collectionField.type === 'manyOf' || collectionField.type === 'oneOf') &&
            collectionField.name
          }
          fieldName={`${this.props.field.type}DefaultValue`}
          type={FieldComponent}
          {...collectionField.options}
          {...this.props.passProps}
        />
      </div>
    )
  }
}
