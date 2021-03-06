import React from 'react'
import {Field} from 'simple-react-form'
import iconOptions from 'App/components/Icon/options'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'

export default class RunHooks extends React.Component {
  static propTypes = {}

  render() {
    return [
      <div key={1} className="col-xs-12 col-sm-6 col-md-8">
        <div className="label">Icono</div>
        <Field fieldName="options.icon" type={Select} options={iconOptions} />
      </div>,
      <div key={2} className="col-xs-12" style={{marginTop: 5}}>
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <div className="label">Tooltip</div>
            <Field fieldName="options.tooltip" type={Text} />
          </div>
          <div className="col-xs-12 col-sm-6">
            <div className="label">URL</div>
            <Field fieldName="options.url" type={Text} />
          </div>
        </div>
      </div>
    ]
  }
}
