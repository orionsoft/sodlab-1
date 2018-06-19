import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Breadcrumbs from '../../Breadcrumbs'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'

@withGraphQL(gql`
  query getForm($linkId: ID, $environmentId: ID) {
    link(linkId: $linkId) {
      _id
      path
      title
    }
    forms(limit: null, environmentId: $environmentId) {
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
    link: PropTypes.object,
    collections: PropTypes.object,
    forms: PropTypes.object
  }

  render() {
    if (!this.props.link) return
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
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              linkId: this.props.link._id,
              link: this.props.link
            }}
          />
          <br />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
        </Section>
      </div>
    )
  }
}
