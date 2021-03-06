import React from 'react'
import withModal from 'orionsoft-parts/lib/decorators/withModal'
import PropTypes from 'prop-types'
import styles from './styles.css'
import Button from 'orionsoft-parts/lib/components/Button'
import autobind from 'autobind-decorator'
import WithParams from 'App/components/AutoForm/WithParams'
import WithMutation from 'App/components/AutoForm/WithMutation'
import getFragment from 'App/components/AutoForm/getFragment'

@withModal
export default class FormModal extends React.Component {
  static propTypes = {
    showModal: PropTypes.func,
    label: PropTypes.node,
    message: PropTypes.node,
    title: PropTypes.node,
    children: PropTypes.node,
    confirmText: PropTypes.node,
    mutation: PropTypes.string,
    params: PropTypes.object,
    only: PropTypes.any,
    omit: PropTypes.any,
    onSuccess: PropTypes.func,
    primary: PropTypes.bool,
    danger: PropTypes.bool,
    fragment: PropTypes.any,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    onSuccess: () => {},
    primary: false,
    danger: false
  }

  state = {}

  @autobind
  async submit() {
    try {
      this.errorMessage = null
      const result = await this.mutate(this.props.params)
      this.props.onSuccess(result)
    } catch (error) {
      if (error.graphQLErrors) {
        const message = error.graphQLErrors.map(err => err.message).join('. ')
        this.errorMessage = message
      } else {
        this.errorMessage = error.message
      }
      return false
    }
  }

  @autobind
  async open(mutate) {
    this.mutate = mutate
    await this.props.showModal({
      title: this.props.title,
      confirm: this.submit,
      confirmText: this.props.confirmText,
      render: this.renderContent,
      cancelText: 'Cancelar'
    })
  }

  getFragment({name, result, basicResultQuery, params}) {
    if (this.props.fragment) {
      return this.props.fragment
    } else {
      return getFragment({name, result, basicResultQuery, params})
    }
  }

  @autobind
  renderContent() {
    return (
      <div>
        <div className={styles.message}>{this.props.message}</div>
        <div className={styles.error}>{this.errorMessage}</div>
      </div>
    )
  }

  renderButton() {
    return (
      <WithParams name={this.props.mutation}>
        {({name, result, basicResultQuery, params}) => (
          <WithMutation
            params={params}
            fragment={this.getFragment({name, result, basicResultQuery, params})}
            mutation={this.props.mutation}>
            {mutate =>
              this.props.children ? (
                React.cloneElement(this.props.children, {
                  onClick: () => this.open(mutate),
                  onPress: () => this.open(mutate)
                })
              ) : (
                <Button
                  disabled={this.props.disabled}
                  danger={this.props.danger}
                  primary={this.props.primary}
                  onClick={() => this.open(mutate)}>
                  {this.props.label}
                </Button>
              )
            }
          </WithMutation>
        )}
      </WithParams>
    )
  }

  render() {
    return this.renderButton()
  }
}
