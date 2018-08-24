import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import PropTypes from 'prop-types'
import Fields from './Fields'
import Indexes from './Indexes'
import MutationButton from 'App/components/MutationButton'
import autobind from 'autobind-decorator'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withRoles from 'App/helpers/auth/withRoles'
import Export from './Export'

@withGraphQL(gql`
  query getCollection($collectionId: ID) {
    collection(collectionId: $collectionId) {
      _id
      name
      environmentId
      ...adminCollectionFieldsUpdateFragment
    }
  }
  ${Fields.fragment}
`)
@withRoles
@withMessage
export default class Collection extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    collection: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    roles: PropTypes.array
  }

  @autobind
  removeCollection() {
    const {environmentId} = this.props.match.params
    this.props.showMessage('La colección fue eliminada')
    this.props.history.push(`/${environmentId}/collections`)
  }

  renderRemoveCollection() {
    const {roles} = this.props
    if (!roles.includes('superAdmin')) return null
    return (
      <div className={styles.removeButton}>
        <MutationButton
          label="Eliminar"
          title="¿Confirma que desea eliminar esta colección?"
          confirmText="Confirmar"
          mutation="removeCollection"
          onSuccess={this.removeCollection}
          params={{collectionId: this.props.collection._id}}
          danger
        />
      </div>
    )
  }

  render() {
    if (!this.props.collection) return null
    const {params} = this.props.match

    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.collection.name}</Breadcrumbs>
        <Fields collection={this.props.collection} params={params} />
        <Indexes collection={this.props.collection} />
        <Export collectionId={this.props.collection._id} />
        <br />
        <br />
        <br />
        <br />
        {this.renderRemoveCollection()}
      </div>
    )
  }
}
