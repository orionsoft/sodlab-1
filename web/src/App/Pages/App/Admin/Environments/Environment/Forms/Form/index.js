import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import PropTypes from 'prop-types'

@withGraphQL(gql`
  query getForm($formId: ID) {
    form(formId: $formId) {
      _id
      name
    }
  }
`)
export default class Form extends React.Component {
  static propTypes = {
    form: PropTypes.object
  }

  render() {
    if (!this.props.form) return
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.form.name}</Breadcrumbs>
      </div>
    )
  }
}
