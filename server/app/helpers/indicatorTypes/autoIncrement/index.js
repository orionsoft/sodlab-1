import Counters from './Counters'

export default {
  name: 'Valor Autoincremental',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    name: {
      type: String,
      label: 'Identificador único'
    }
  },
  getRenderType: () => 'number',
  async getResult({options, environmentId}) {
    const query = {name: options.name, environmentId}
    const result = await Counters.findOneAndUpdate(
      query,
      {$inc: {counter: 1}},
      {upsert: true, new: true}
    )

    if (!result) return 1
    return result.counter + 1
  }
}
