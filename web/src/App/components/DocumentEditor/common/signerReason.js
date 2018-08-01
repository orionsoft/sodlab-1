import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'

@withGraphQL(gql`
  query getDocument($materia: ID!) {
    getDocument(_id: $materia) {
      data
    }
  }
`)
export default class SignerReason extends React.Component {
  static propTypes = {
    getDocument: PropTypes.object,
    styles: PropTypes.object,
    handleWhyChange: PropTypes.func
  }

  componentDidMount() {
    if (!this.props.getDocument) return
    const {data} = this.props.getDocument
    if (typeof data.nombre === 'undefined') return
    this.props.handleWhyChange(data.nombre)
  }

  render() {
    return (
      <div className={this.props.styles.inputContainer}>
        <label htmlFor="signatureReason">Motivo:</label>
        <input
          type="text"
          id="signatureReason"
          name="signatureReason"
          onChange={e => this.props.handleWhyChange(e.target.value)}
          value={this.props.why}
        />
      </div>
    )
  }
}
