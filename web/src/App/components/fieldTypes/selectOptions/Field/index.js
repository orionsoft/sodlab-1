import React from 'react'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import PropTypes from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'

export default class CollectionSelect extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
    passProps: PropTypes.object,
    errorMessage: PropTypes.node
  }

  onChange(element, index, changes) {
    const value = cloneDeep(this.props.value)
    value[index][element] = changes
    this.props.onChange(value)
  }

  render() {
    return (
      <ArrayComponent
        draggable={true}
        value={this.props.value}
        onChange={this.props.onChange}
        errorMessage={this.props.errorMessage}
        {...this.props.passProps}
        renderItem={(item, index) => (
          <div>
            <div className="label">Campo de valor</div>
            <Text
              value={this.props.value[index]['value']}
              onChange={changes => this.onChange('value', index, changes)}
            />
            <div className="label">Campo de título</div>
            <Text
              value={this.props.value[index]['label']}
              onChange={changes => this.onChange('label', index, changes)}
            />
          </div>
        )}
      />
    )
  }
}
