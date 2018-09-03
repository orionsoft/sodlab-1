import React from 'react'
import styles from './styles.css'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Section from 'App/components/Section'
import AutoForm from 'App/components/AutoForm'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import clone from 'lodash/clone'

@withMessage
export default class Customization extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    environment: PropTypes.object
  }

  static fragment = gql`
    fragment adminEnvironmentCustomizationUpdateFragment on Environment {
      _id
      logo {
        _id
      }
      authBackgroundImage {
        _id
      }
      fontName
      sideBarColor
      sideBarTextColor
    }
  `

  render() {
    return (
      <div className={styles.container}>
        <Section
          title="Personalización"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
          top>
          <AutoForm
            mutation="setEnvironmentCustom"
            ref="form"
            only="custom"
            doc={{environmentId: this.props.environment._id, custom: clone(this.props.environment)}}
            onSuccess={() => this.props.showMessage('Personalización guardada')}
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
