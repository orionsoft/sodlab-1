import React from 'react'
import PropTypes from 'prop-types'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import iconOptions from 'App/components/Icon/options'
import {Field} from 'simple-react-form'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'

@withGraphQL(gql`
  query getViews($environmentId: ID) {
    views(environmentId: $environmentId) {
      items {
        value: path
        label: name
        pathVariables
      }
    }
  }
`)
export default class RouteIconButton extends React.Component {
  static propTypes = {
    collection: PropTypes.object,
    views: PropTypes.object,
    field: PropTypes.object
  }

  getView() {
    if (!this.props.field.options) return
    if (!this.props.field.options.viewPath) return
    return this.props.views.items.find(view => view.value === this.props.field.options.viewPath)
  }

  renderVariables() {
    const view = this.getView()
    if (!view) return
    if (!view.pathVariables.length) return
    const fromOptions = [{label: 'ID', value: '_id'}, ...this.props.collection.fields]
    return view.pathVariables.map(variableName => {
      return (
        <div key={variableName} className="col-xs-12 col-sm-6" style={{marginTop: 10}}>
          <div className="label">
            Valor para <code>:{variableName}</code>
          </div>
          <Field
            fieldName={`options.variableMap.${variableName}`}
            type={Select}
            options={fromOptions}
          />
          <div className="description">Nombre del parametro</div>
        </div>
      )
    })
  }

  render() {
    return [
      <div key={1} className="col-xs-12 col-sm-6 col-md-4">
        <div className="label">Icono</div>
        <Field fieldName="options.icon" type={Select} options={iconOptions} />
      </div>,
      <div key={2} className="col-xs-12" style={{marginTop: 5}}>
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <div className="label">Ruta</div>
            <Field fieldName="options.viewPath" type={Select} options={this.props.views.items} />
          </div>
          <div className="col-xs-12 col-sm-6">
            <div className="label">Tooltip</div>
            <Field fieldName="options.tooltip" type={Text} />
          </div>
        </div>
        <div className="row">{this.renderVariables()}</div>
      </div>
    ]
  }
}
