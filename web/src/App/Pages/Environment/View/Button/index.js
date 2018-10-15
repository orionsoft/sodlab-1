import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'
import icons from 'App/components/Icon/icons'
import IconButton from 'orionsoft-parts/lib/components/IconButton'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import Button from 'orionsoft-parts/lib/components/Button'
import {withRouter} from 'react-router'

@withGraphQL(gql`
  query button($buttonId: ID) {
    button(buttonId: $buttonId) {
      _id
      title
      buttonType
      goBack
      buttonText
      url
      icon
    }
  }
`)
@withMutation(gql`
  mutation buttonRunHooks($buttonId: ID, $parameters: JSON) {
    buttonRunHooks(buttonId: $buttonId, parameters: $parameters)
  }
`)
@withRouter
@withMessage
export default class ButtonView extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    showMessage: PropTypes.func,
    button: PropTypes.object,
    buttonRunHooks: PropTypes.func,
    parameters: PropTypes.object
  }

  async onClick(data) {
    if (this.props.button.goBack) return this.props.history.goBack()
    try {
      await this.props.buttonRunHooks({buttonId: data._id, parameters: this.props.parameters})
      if (data.url) {
        this.props.history.push(data.url)
      }
      this.props.showMessage('Hecho')
    } catch (error) {
      this.props.showMessage(error)
    }
  }

  renderWithIcon(data) {
    const icon = icons[data.icon]
    return (
      <div className={styles.button}>
        <IconButton icon={icon} size={30} onPress={() => this.onClick(data)} />
      </div>
    )
  }

  renderWithText(data) {
    return (
      <div className={styles.button} onClick={() => this.onClick(data)}>
        <div className={styles.text}>{data.buttonText}</div>
      </div>
    )
  }

  renderWithButtton(data) {
    return (
      <div className={styles.button}>
        <Button primary onClick={() => this.onClick(data)}>
          {data.buttonText}
        </Button>
      </div>
    )
  }

  renderButttonByOptions(button) {
    if (button.buttonType === 'icon') return this.renderWithIcon(button)
    if (button.buttonType === 'text') return this.renderWithText(button)
    if (button.buttonType === 'button') return this.renderWithButtton(button)
  }

  render() {
    const {button} = this.props
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>{button.title}</div>
        </div>
        {this.renderButttonByOptions(button)}
      </div>
    )
  }
}
