import React from 'react'
import {Field} from 'simple-react-form'
import iconOptions from 'App/components/Icon/options'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import HookSelect from 'App/components/fieldTypes/hookSelect/Field'
import Checkbox from 'App/components/fieldTypes/checkbox/Field'

export default class RunHooks extends React.Component {
  static propTypes = {}

  render() {
    return [
      <div key={1} className="col-xs-8" style={{marginTop: 5}}>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6">
            <div className="label">Icono</div>
            <Field fieldName="options.icon" type={Select} options={iconOptions} />
          </div>
          <div className="col-xs-12 col-sm-6 col-md-6">
            <div className="label">Texto modal (opcional)</div>
            <Field fieldName="options.modalText" type={Text} />
          </div>
        </div>
      </div>,
      <div key={2} className="col-xs-12" style={{marginTop: 5}}>
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <div className="label">Tooltip</div>
            <Field fieldName="options.tooltip" type={Text} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <div className="label">Hooks</div>
            <Field fieldName="options.hooksIds" multi type={HookSelect} />
            <Field
              fieldName="options.requireTwoFactor"
              type={Checkbox}
              label="Requiere dos factores"
            />
          </div>
          <div className="col-xs-12 col-sm-6">
            <div className="label">Detener la ejecución si ocurre un error</div>
            <Field
              fieldName="options.shouldStopHooksOnError"
              type={Select}
              options={[{label: 'Si', value: true}, {label: 'No', value: false}]}
            />
          </div>
        </div>
      </div>
    ]
  }
}
