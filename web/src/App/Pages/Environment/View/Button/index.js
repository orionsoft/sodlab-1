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
      environmentId
      title
      buttonType
      goBack
      buttonText
      url
      icon
      afterHooksIds
      postItemToUrl
      helperType
      onSuccessMessage
      onErrorMessage
      parameters {
        parameterName
        value
      }
    }
  }
`)
@withMutation(gql`
  mutation buttonRunHooks($button: JSON, $parameters: JSON, $singular: Boolean) {
    buttonRunHooks(button: $button, parameters: $parameters, singular: $singular)
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

  renderSuccessMessage({onSuccessMessage}) {
    if (onSuccessMessage && onSuccessMessage.length > 0) {
      this.props.showMessage(onSuccessMessage)
    } else {
      this.props.showMessage('Hecho')
    }
  }

  renderErrorMessage({onErrorMessage}, err) {
    if (onErrorMessage && onErrorMessage.length > 0) {
      this.props.showMessage(onErrorMessage)
    } else {
      this.props.showMessage(err)
    }
  }

  parseParameters(result = {}) {
    const availableParameters = {
      ...this.props.parameters,
      ...result,
      environmentId: this.props.button.environmentId
    }
    if (!this.props.button.parameters || !this.props.button.parameters.length)
      return availableParameters

    const buttonParameters = this.props.button.parameters
    let parsedParams = {}
    for (const obj of buttonParameters) {
      const existsInView = Object.keys(availableParameters).includes(obj.value)
      if (existsInView) {
        parsedParams[obj.parameterName] = availableParameters[obj.value]
      } else {
        parsedParams[obj.parameterName] = obj.value
      }
    }
    return {...availableParameters, ...parsedParams}
  }

  parseUrl(url, parameters) {
    const parametersArray = Object.keys(parameters)
    return new Promise((resolve, reject) => {
      let path = url
      const pathVars = path
        .split('/')
        .filter(key => /^:/.test(key))
        .map(key => key.replace(':', ''))
      if (!pathVars || pathVars.length === 0) resolve(path)

      const missingKeys = []
      const allKeysIncluded = pathVars.every(key => {
        if (parametersArray.includes(key)) {
          return true
        } else {
          missingKeys.push(key)
          return false
        }
      })
      if (!allKeysIncluded) {
        reject(missingKeys)
      }

      for (const key of parametersArray) {
        const value = parameters[key]
        path = path.replace(`:${key}`, value)
      }
      resolve(path)
    })
  }

  async onClick(data) {
    let parameters = this.parseParameters()
    let path = null
    try {
      if (data.afterHooksIds.length > 0) {
        const result = await this.props.buttonRunHooks({
          button: data,
          parameters: parameters,
          singular: true
        })
        parameters = this.parseParameters(result.buttonRunHooks)
      }
    } catch (err) {
      this.renderErrorMessage(data, err)
    }

    if (data.url) {
      try {
        path = await this.parseUrl(data.url, parameters).catch(missingKeys => {
          console.log(`Missing the following params ${missingKeys.join('-')}`)
          throw new Error('No se ha podido redireccionar a la vista deseada')
        })
      } catch (err) {
        this.renderErrorMessage(data, err)
      }
    }

    if (this.props.button.buttonType === 'postItemToUrl') {
      await this.postItem(data, parameters).catch(err => {
        this.renderErrorMessage(data, err)
      })
    }
    this.renderSuccessMessage(data)
    if (this.props.button.goBack) return this.props.history.goBack()
    if (path) return this.props.history.push(path)
  }

  async postItem({postItemToUrl}, parameters) {
    try {
      let url = await this.parseUrl(postItemToUrl, parameters)
      const data = parameters
      await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  renderWithPostItemUrl(button) {
    if (button.helperType === 'icon') return this.renderWithIcon(button)
    if (button.helperType === 'text') return this.renderWithText(button)
    if (button.helperType === 'button') return this.renderWithButtton(button)
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
    if (button.buttonType === 'postItemToUrl') return this.renderWithPostItemUrl(button)
  }

  renderTitle(button) {
    if (!button || !button.title) return null
    return (
      <div className={styles.header}>
        <div className={styles.title}>{button.title}</div>
      </div>
    )
  }

  render() {
    const {button} = this.props
    return (
      <div className={styles.container}>
        {this.renderTitle(button)}
        {this.renderButttonByOptions(button)}
      </div>
    )
  }
}
