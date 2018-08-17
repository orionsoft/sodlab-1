import React from 'react'
import styles from './styles.css'
import Breadcrumbs from '../Breadcrumbs'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import Button from 'orionsoft-parts/lib/components/Button'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import ProfileFields from './ProfileFields'
import Export from './Export'
import Import from './Import'
import RemoveEnvironment from './RemoveEnvironment'

@withMessage
@withGraphQL(gql`
  query getEnvironment($environmentId: ID) {
    environment(environmentId: $environmentId) {
      _id
      name
      url
      logo {
        _id
      }
      authBackgroundImage {
        _id
      }
      fontName
      liorenId
      intercomId
      ...adminEnvironmentProfilesUpdateFragment
    }
  }
  ${ProfileFields.fragment}
`)
export default class Configuration extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    environment: PropTypes.object
  }

  render() {
    return (
      <div className={styles.container}>
        <Breadcrumbs />
        <Section
          title="Configuración"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          top>
          <AutoForm
            mutation="setEnvironmentConfig"
            ref="form"
            only="config"
            doc={{environmentId: this.props.environment._id, config: this.props.environment}}
            onSuccess={() => this.props.showMessage('Configuración guardada')}
          />
          <br />
          <Button onClick={() => this.refs.form.submit()} primary>
            Guardar
          </Button>
        </Section>
        <ProfileFields environment={this.props.environment} />
        <Export environment={this.props.environment} />
        <Import environment={this.props.environment} />
        <RemoveEnvironment environmentId={this.props.environment._id} />
      </div>
    )
  }
}
