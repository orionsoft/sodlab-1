import React from 'react'
import {Field} from 'simple-react-form'
import ButtonSelect from 'App/components/fieldTypes/buttonSelect/Field'

export default class MultipleSelect extends React.Component {
  static propTypes = {}

  render() {
    return [
      <div key={1} className="col-xs-8" style={{marginTop: 5}}>
        <div className="label">Botones a ejecutar</div>
        <Field fieldName="options.buttonsIds" multi type={ButtonSelect} />
      </div>
    ]
  }
}
