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
  query hook($hookId: ID) {
    hook(hookId: $hookId) {
      _id
      name
    }
  }
`)
@withMessage
export default class Hook extends React.Component {
  static propTypes = {
    hook: PropTypes.object,
    showMessage: PropTypes.object
  }

  render() {
    if (!this.props.hook) return null
    return (
      <div className={styles.container}>
        <Breadcrumbs>{this.props.hook.name}</Breadcrumbs>
        <Section
          top
          title={`Editar hook ${this.props.hook.name}`}
          description="Ita multos efflorescere. Non te export possumus nam tamen praesentibus voluptate
        ipsum voluptate. Amet consequat admodum. Quem fabulas offendit.">
          <AutoForm
            mutation="updateHook"
            ref="form"
            only="hook"
            onSuccess={() => this.props.showMessage('Los campos fueron guardados')}
            doc={{
              hookId: this.props.hook._id,
              hook: this.props.hook
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
