import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import Param from './Param'
import includes from 'lodash/includes'
import isArray from 'lodash/isArray'

export default class Fields extends React.Component {
  static propTypes = {
    params: PropTypes.object,
    schemaToField: PropTypes.func,
    parent: PropTypes.any,
    omit: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    only: PropTypes.string,
    passProps: PropTypes.object,
    fields: PropTypes.array
  }

  static defaultProps = {
    passProps: {}
  }

  renderFields(params) {
    if (!params) return
    if (Object.keys(params).length === 0) return

    const omit = isArray(this.props.omit) ? this.props.omit : [this.props.omit]

    return Object.keys(params)
      .filter(key => (this.props.only ? key === this.props.only : true))
      .filter(key => !includes(omit, key))
      .map(key => {
        return (
          <Param
            key={key}
            only={this.props.only}
            parent={this.props.parent}
            field={params[key]}
            fieldName={key}
            schemaToField={this.props.schemaToField}
            passProps={this.props.passProps}
            fields={this.props.fields}
          />
        )
      })
  }

  render() {
    return <div className={styles.container}>{this.renderFields(this.props.params)}</div>
  }
}
