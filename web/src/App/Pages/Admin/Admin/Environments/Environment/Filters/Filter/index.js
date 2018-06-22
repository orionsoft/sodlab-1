import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'

@withGraphQL(gql`
  query getFilter($filterId: ID) {
    filter(filterId: $filterId) {
      _id
      name
    }
  }
`)
@withMessage
export default class Filter extends React.Component {
  static propTypes = {
    filter: PropTypes.object,
    showMessage: PropTypes.object
  }

  render() {
    if (!this.props.filter) return null
    return (
      <div className={styles.container}>
        <div className={styles.container}>
          <Breadcrumbs>{this.props.filter.name}</Breadcrumbs>
          <Section
            top
            title={`Editar gráfico ${this.props.filter.name}`}
            description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
          ipsum voluptate. Amet consequat admodum. Quem fabulas offendit."
          >
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
            <Button onClick={() => this.refs.form.submit()} primary>
              Guardar
            </Button>
          </Section>
        </div>
      </div>
    )
  }
}
