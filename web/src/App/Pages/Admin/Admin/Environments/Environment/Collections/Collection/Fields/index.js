import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import Button from 'orionsoft-parts/lib/components/Button'
import AutoForm from 'App/components/AutoForm'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import clone from 'lodash/clone'
import autobind from 'autobind-decorator'
import {withRouter} from 'react-router'

@withRouter
@withMessage
export default class Fields extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    history: PropTypes.object,
    showMessage: PropTypes.func,
    collection: PropTypes.object,
    params: PropTypes.object
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

  @autobind
  onSuccess() {
    const {environmentId} = this.props.params
    this.props.showMessage('Los campos fueron guardados')
    this.props.history.push(`/admin/environments/${environmentId}/collections`)
  }

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
            onSuccess={this.onSuccess}
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
