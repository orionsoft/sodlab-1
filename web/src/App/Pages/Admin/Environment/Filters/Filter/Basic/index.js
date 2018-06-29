import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import Button from 'orionsoft-parts/lib/components/Button'
import MutationButton from 'App/components/MutationButton'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import {withRouter} from 'react-router'

@withMessage
@withGraphQL(gql`
  query filter($filterId: ID) {
    filter(filterId: $filterId) {
      _id
      name
      environmentId
    }
  }
`)
@withRouter
export default class Basic extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    filter: PropTypes.object
  }

  remove() {
    const {environmentId} = this.props.filter
    this.props.showMessage('Elemento eliminado satisfactoriamente!')
    this.props.history.push(`/${environmentId}/filters`)
  }

  render() {
    return (
      <div className={styles.container}>
        <Section
          top
          title={`Editar filtro ${this.props.filter.name}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateFilter"
            ref="form"
            only="filter"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              filterId: this.props.filter._id,
              filter: this.props.filter
            }}
          />
          <br />
          <Button to={`/${this.props.filter.environmentId}/filters`} style={{marginRight: 10}}>
            Volver
          </Button>
          <MutationButton
            label="Eliminar"
            title="Eliminar filtro"
            message="¿Quieres eliminar este filtro?"
            confirmText="Eliminar"
            mutation="removeFilter"
            onSuccess={() => this.remove()}
            params={{filterId: this.props.filter._id}}
            danger
          />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
        </Section>
      </div>
    )
  }
}
