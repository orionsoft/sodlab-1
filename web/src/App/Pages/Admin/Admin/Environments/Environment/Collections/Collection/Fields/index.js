import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import clone from 'lodash/clone'

@withMessage
export default class Fields extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    collection: PropTypes.object
  }

  static fragment = gql`
    fragment adminCollectionFieldsUpdateFragment on Collection {
      _id
      fields {
        name
        type
        label
      }
    }
  `

  render() {
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
            omit="collectionId"
            fragment={Fields.fragment}
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              collectionId: this.props.collection._id,
              fields: clone(this.props.collection.fields)
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
