import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default {
  name: 'Valor: De una variable del Schema del Usuario',
  requireCollection: false,
  requiredField: false,
  optionsSchema: {
    value: {
      type: String,
      label: 'Nombre de la variable del Schema del usuario'
    }
  },
  getRenderType: () => 'text',
  async getResult({options: {value}, userId}) {
    const {profile} = await EnvironmentUsers.findOne({userId})
    return profile ? profile[value] : null
  }
}
