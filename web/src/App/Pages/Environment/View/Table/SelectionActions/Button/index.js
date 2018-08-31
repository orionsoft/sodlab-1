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

@withGraphQL(gql`
  query button($buttonId: ID) {
    button(buttonId: $buttonId) {
      _id
      title
      buttonType
      buttonText
      url
      icon
    }
  }
`)
@withMutation(gql`
  mutation buttonSubmitBatch($buttonId: ID, $parameters: [JSON]) {
    buttonSubmitBatch(buttonId: $buttonId, parameters: $parameters)
  }
`)
@withMessage
export default class ButtonView extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    button: PropTypes.object,
    buttonSubmitBatch: PropTypes.func,
    items: PropTypes.array
  }

  async onClick() {
    try {
      await this.props.buttonSubmitBatch({
        buttonId: this.props.button._id,
        parameters: this.props.items
      })
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

  render() {
    const {button} = this.props
    if (button.buttonType === 'icon') return this.renderWithIcon(button)
    if (button.buttonType === 'text') return this.renderWithText(button)
    if (button.buttonType === 'button') return this.renderWithButtton(button)
    return null
  }
}
