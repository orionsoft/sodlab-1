import Validations from 'app/collections/Validations'
import Hooks from 'app/collections/Hooks'

export default {
  name: 'Switch con validación',
  optionsSchema: {
    validationsIds: {
      type: [String],
      label: 'Validaciones',
      min: 1,
      fieldType: 'validationSelect',
      fieldOptions: {
        multi: true
      }
    },
    passesHooksIds: {
      type: [String],
      label: 'Hooks a ejecutar si pasa la validación',
      fieldType: 'hookSelect',
      fieldOptions: {
        multi: true
      }
    },
    failsHooksIds: {
      type: [String],
      label: 'Hooks a ejecutar si no pasa la validación',
      fieldType: 'hookSelect',
      fieldOptions: {
        multi: true
      }
    }
  },
  async execute({itemId, params, options: {validationsIds, passesHooksIds, failsHooksIds}}) {
    let previousResult = (params || {}).previousResult
    let passes = null
    try {
      for (const validationId of validationsIds || []) {
        const validation = await Validations.findOne(validationId)
        await validation.execute({params})
      }
    } catch (error) {
      passes = false
    }
    if (passes) {
      for (const hookId of passesHooksIds) {
        const hook = await Hooks.findOne(hookId)
        previousResult = await hook.execute({params: {previousResult, ...params}, itemId})
      }
    } else {
      try {
        for (const hookId of failsHooksIds) {
          const hook = await Hooks.findOne(hookId)
          previousResult = await hook.execute({params: {previousResult, ...params}, itemId})
        }
      } catch (error) {
        console.log('Error running hook', error)
      }
    }
  }
}
