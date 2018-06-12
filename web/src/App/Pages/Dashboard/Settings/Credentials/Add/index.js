import React from 'react'
import styles from './styles.css'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import Button from 'orionsoft-parts/lib/components/Button'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import PropTypes from 'prop-types'

@withMessage
export default class List extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func
  }

  render() {
    return (
      <div className={styles.container}>
        <Section
          title="Add a new credential"
          description="Add a credential to use it in your apps"
          top>
          <AutoForm
            mutation="createCredential"
            ref="form"
            onSuccess={() => this.props.showMessage('Your keys where saved')}
          />
          <br />
          <Button to="/settings/credentials" style={{marginRight: 10}}>
            Cancel
          </Button>
          <Button onClick={() => this.refs.form.submit()} primary>
            Save
          </Button>
        </Section>
      </div>
    )
  }
}
