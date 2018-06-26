import React from 'react'
import styles from './styles.css'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import AutoForm from 'App/components/AutoForm'
import Fields from 'App/components/AutoForm/Fields'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import Button from 'orionsoft-parts/lib/components/Button'
import schemaToField from 'App/components/schemaToField'
import autobind from 'autobind-decorator'

@withGraphQL(gql`
  query getForm($formId: ID) {
    form(formId: $formId) {
      _id
      title
      name
      type
      serializedParams
    }
  }
`)
@withMessage
export default class Form extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    form: PropTypes.object
  }

  state = {}

  renderSubmitButton() {
    const text = this.props.form.type === 'create' ? 'Crear' : 'Guardar'
    return (
      <Button onClick={() => this.refs.form.submit()} primary>
        {text}
      </Button>
    )
  }

  @autobind
  onSuccess() {
    this.setState({data: {}})
    this.props.showMessage('Se completó con exito')
  }

  render() {
    const params = {data: {type: this.props.form.serializedParams}}
    return (
      <div className={styles.container}>
        <div className={styles.title}>{this.props.form.title}</div>
        <AutoForm
          mutation="submitForm"
          ref="form"
          only="data"
          doc={{formId: this.props.form._id, data: this.state.data}}
          onSuccess={this.onSuccess}>
          {({parent}) => <Fields schemaToField={schemaToField} parent={parent} params={params} />}
        </AutoForm>
        <br />
        {this.renderSubmitButton()}
      </div>
    )
  }
}
