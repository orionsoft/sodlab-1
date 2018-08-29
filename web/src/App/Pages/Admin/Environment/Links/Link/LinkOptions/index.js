import React from 'react'
import PropTypes from 'prop-types'
import {Field} from 'simple-react-form'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'

export default class LinkOptions extends React.Component {
  static propTypes = {
    link: PropTypes.object
  }

  renderCategory() {
    return (
      <Field fieldName="fields" type={ArrayComponent}>
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6">
            <div className="label">Título</div>
            <Field fieldName="title" type={Text} />
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6">
            <div className="label">Ruta</div>
            <Field fieldName="path" type={Text} />
          </div>
        </div>
      </Field>
    )
  }

  renderPath() {
    return (
      <div>
        <div className="label">Ruta</div>
        <Field fieldName="path" type={Text} />
      </div>
    )
  }

  render() {
    const {link} = this.props
    if (!link.type) return null
    if (link.type === 'path') return this.renderPath()
    if (link.type === 'category') return this.renderCategory()
    return 'undefined type'
  }
}
