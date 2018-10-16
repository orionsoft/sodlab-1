export default {
  name: 'Fecha: Actual sin hora',
  requireCollection: false,
  requireField: false,
  optionsSchema: null,
  getRenderType: () => 'date',
  async getResult() {
    return new Date()
  }
}
