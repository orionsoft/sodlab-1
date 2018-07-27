import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import FormContent from './Form'
import styles from './styles.css'
import {FaArrowsAlt, FaClose} from 'react-icons/lib/fa'
import autobind from 'autobind-decorator'

@withGraphQL(gql`
  query getForm($formId: ID) {
    form(formId: $formId) {
      _id
      title
      type
      serializedParams
      updateVariableName
      fullSize
      onSuccessViewPath
    }
  }
`)
export default class Form extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    form: PropTypes.object,
    parameters: PropTypes.object
  }

  state = {fullSize: false}

  getItemId() {
    if (this.props.form.type === 'create') return null
    return this.props.parameters[this.props.form.updateVariableName]
  }

  renderNoItem() {
    return <div className={styles.noItem}>Selecciona un documento</div>
  }

  renderForm() {
    const props = {
      form: this.props.form,
      formId: this.props.form._id,
      data: this.state.data || {},
      itemId: this.getItemId(),
      parameters: this.props.parameters || {}
    }
    if (props.form.type === 'update' && !props.itemId) return this.renderNoItem()
    return <FormContent {...props} />
  }

  @autobind
  fullScreen() {
    this.setState({fullSize: !this.state.fullSize})
  }

  renderFullSize() {
    return this.state.fullSize ? (
      <FaClose onClick={this.fullScreen} style={{cursor: 'pointer'}} />
    ) : (
      <FaArrowsAlt onClick={this.fullScreen} style={{cursor: 'pointer'}} />
    )
  }

  @autobind
  renderButtons(form) {
    return <div className="row end-xs">{form.fullSize && this.renderFullSize()}</div>
  }

  render() {
    if (!this.props.form) return null
    const {form} = this.props
    console.log('form1', form)
    return (
      <div className={this.state.fullSize ? styles.fullSize : styles.container}>
        <div className="row">
          <div className="col-xs-10 col-sm-">
            <div className={styles.title}>{form.title}</div>
          </div>
          <div className="col-xs-2 col-sm-">{this.renderButtons(form)}</div>
        </div>
        {this.renderForm()}
      </div>
    )
  }
}
