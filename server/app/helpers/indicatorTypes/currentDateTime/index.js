export default {
  name: 'Fecha: Actual con hora',
  requireCollection: false,
  requireField: false,
  optionsSchema: null,
  getRenderType: () => 'datetime',
  async getResult() {
    return new Date()
  }
}
