import React from 'react'
import PropTypes from 'prop-types'
import styles from '../styles.css'
import autobind from 'autobind-decorator'
import Section from 'App/components/Section'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import MutationButton from 'App/components/MutationButton'

@withMessage
export default class RemoveData extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    collectionId: PropTypes.string,
    history: PropTypes.object,
    match: PropTypes.object,
    roles: PropTypes.string
  }

  state = {}

  @autobind
  removeCollection() {
    const {environmentId} = this.props.params
    this.props.showMessage('La colección fue eliminada')
    this.props.history.push(`/${environmentId}/collections`)
  }

  @autobind
  removeDataCollection() {
    const {environmentId} = this.props.params
    this.props.showMessage('Los datos de la colección fueron eliminados')
    this.props.history.push(`/${environmentId}/collections`)
  }

  renderRemoveCollection() {
    const {roles} = this.props
    if (!roles.includes('superAdmin')) return null
    return (
      <div className={styles.removeButton}>
        <MutationButton
          label="Eliminar Colección"
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

  renderRemoveDataCollection() {
    const {roles} = this.props
    if (!roles.includes('superAdmin')) return null
    return (
      <div className={styles.removeButton}>
        <MutationButton
          label="Eliminar Datos de la Colección"
          title="¿Confirma que desea eliminar los datos de la colección?"
          confirmText="Confirmar"
          mutation="removeDataCollection"
          onSuccess={this.removeDataCollection}
          params={{collectionId: this.props.collection._id}}
        />
      </div>
    )
  }

  render() {
    return (
      <div className="">
        <Section title="Eliminar datos" description="Eliminar todos los datos de la colección">
          {this.renderRemoveDataCollection()}
        </Section>
        <br />
        <br />
        <br />
        <br />
        {this.renderRemoveCollection()}
      </div>
    )
  }
}
