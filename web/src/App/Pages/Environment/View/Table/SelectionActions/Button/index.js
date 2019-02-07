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
      buttonText
      url
      icon
      environmentId
      parameters {
        parameterName
        value
      }
    }
  }
`)
@withMutation(gql`
  mutation buttonSubmitBatch($buttonId: ID, $parameters: [JSON], $type: String, $params: JSON) {
    buttonSubmitBatch(buttonId: $buttonId, parameters: $parameters, type: $type, params: $params)
  }
`)
@withMessage
@withRouter
export default class ButtonView extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    button: PropTypes.object,
    buttonSubmitBatch: PropTypes.func,
    items: PropTypes.object,
    all: PropTypes.bool,
    params: PropTypes.object,
    viewParams: PropTypes.object
  }

  parseParameters({buttonSubmitBatch}) {
    const availableParameters = {
      ...this.props.viewParams,
      environmentId: this.props.button.environmentId,
      ...buttonSubmitBatch
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
    let buttonSubmitBatch = {}
    try {
      const response = await this.props.buttonSubmitBatch({
        buttonId: this.props.button._id,
        parameters: this.props.items,
        type: data.buttonType,
        params: this.props.params
      })
      buttonSubmitBatch = response.buttonSubmitBatch
    } catch (error) {
      this.props.showMessage(error)
    }

    let path = null
    if (data.url) {
      try {
        const parameters = this.parseParameters({buttonSubmitBatch})
        path = await this.parseUrl(data.url, parameters).catch(missingKeys => {
          console.log(`Missing the following params ${missingKeys.join('-')}`)
          throw new Error('No se ha podido redireccionar a la vista deseada')
        })
      } catch (error) {
        this.props.showMessage(error)
      }
    }
    if (path) return this.props.history.push(path)
    this.props.showMessage('Hecho')
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

  renderWithHsm(data) {
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
    if (button.buttonType === 'hsm') return this.renderWithHsm(button)
    return null
  }
}
