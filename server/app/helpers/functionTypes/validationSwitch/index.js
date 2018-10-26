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
  async execute({
    params,
    options: {validationsIds, passesHooksIds, failsHooksIds},
    environmentId,
    userId
  }) {
    let previousResult = (params || {}).previousResult
    let passes = true
    try {
      for (const validationId of validationsIds || []) {
        const validation = await Validations.findOne(validationId)
        await validation.execute({params})
      }
    } catch (error) {
      console.log(error)
      passes = false
    }
    if (passes) {
      try {
        for (const hookId of passesHooksIds) {
          const hook = await Hooks.findOne(hookId)
          previousResult = await hook.execute({params: {previousResult, ...params}, userId})
        }
      } catch (err) {
        console.log('Error running hook', error)
        return {success: false}
      }
    } else {
      try {
        for (const hookId of failsHooksIds) {
          const hook = await Hooks.findOne(hookId)
          previousResult = await hook.execute({params: {previousResult, ...params}, userId})
        }
      } catch (error) {
        console.log('Error running hook', error)
        return {success: false}
      }
    }
    return {success: true}
  }
}
