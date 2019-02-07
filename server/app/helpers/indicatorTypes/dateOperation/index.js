import moment from 'moment'
import Collections from 'app/collections/Collections'

export default {
  name: 'Fecha: Operación',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    format: {
      type: String,
      label:
        'Formato a mostrar. Ver opciones disponibles en https://momentjs.com/docs/#/displaying/format/'
    },
    itemId: {
      type: String,
      label: 'ID del item'
    },
    fixedValue: {
      type: Number,
      label: 'Valor fijo con el cual realizar la operación'
    },
    itemValue: {
      type: String,
      label:
        '(opcional) Usar un parametro del item como valor para la operación (acepta números en formato texto). (!!IMPORTANTE: Seleccionar VALOR FIJO si se desea usar está opción. Al usarla tiene preferencia sobre la opción anterior)',
      optional: true
    },
    valueUnit: {
      type: String,
      label: 'Unidad del valor',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Milisegundos', value: 'miliseconds'},
          {label: 'Segundos', value: 'seconds'},
          {label: 'Minutos', value: 'minutes'},
          {label: 'Horas', value: 'hours'},
          {label: 'Días', value: 'days'},
          {label: 'Semanas', value: 'weeks'},
          {label: 'Meses', value: 'months'},
          {label: 'Trimestre', value: 'quarters'},
          {label: 'Años', value: 'years'}
        ]
      }
    },
    operation: {
      type: String,
      label: 'Operación',
      fieldType: 'select',
      fieldOptions: {
        options: [{label: 'Suma', value: 'add'}, {label: 'Resta', value: 'subtract'}]
      }
    },
    specialOperationType: {
      type: String,
      label: '(opcional) Calcula inicio o fin de la fecha',
      fieldType: 'select',
      fieldOptions: {
        options: [{label: 'Comienzo de', value: 'startOf'}, {label: 'Fin de', value: 'endOf'}]
      },
      optional: true
    },
    specialOperationValue: {
      type: String,
      label: '(opcional) Unidad de tiempo a usar para calcular el inicio o fin de la fecha',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Segundo', value: 'second'},
          {label: 'Minuto', value: 'minute'},
          {label: 'Hora', value: 'hour'},
          {label: 'Día', value: 'day'},
          {label: 'Semana', value: 'week'},
          {label: 'Mes', value: 'month'},
          {label: 'Trimestre', value: 'quarter'},
          {label: 'Año', value: 'year'}
        ]
      },
      optional: true
    }
  },
  getRenderType: async ({collectionId, fieldName}) => {
    const collection = await Collections.findOne(collectionId)
    const field = await collection.field({name: fieldName})
    return field.type
  },
  getRenderFormat: ({options}) => {
    if (!options.format.type) {
      return 'DD/MM/YYYY kk:mm'
    }
    return options.format.fixed.value
  },
  async getResult({
    collectionId,
    fieldName,
    options: {
      itemId,
      fixedValue,
      itemValue,
      valueUnit,
      operation,
      specialOperationType,
      specialOperationValue
    }
  }) {
    const collection = await Collections.findOne(collectionId)
    const db = await collection.db()
    if (!itemId) return null
    const item = await db.findOne(itemId)
    if (!item) return null

    const value = itemValue ? parseInt(item.data[itemValue], 10) : fixedValue
    const date = new Date(item.data[fieldName])
    const newDate = moment(date)[operation](value, valueUnit)

    if (!specialOperationType || !specialOperationValue) return new Date(newDate)

    const specialDate = moment(new Date(newDate))[specialOperationType](specialOperationValue)
    const field = await collection.field({name: fieldName})
    const fieldType = field.type

    if (fieldType === 'date') {
      return new Date(specialDate.toDate().setHours(0, 0, 0, 0))
    }
    return new Date(specialDate.toDate())
  }
}
