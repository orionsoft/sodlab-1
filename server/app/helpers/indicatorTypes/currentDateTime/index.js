export default {
  name: 'Fecha: Fecha con hora',
  requireCollection: false,
  requireField: false,
  optionsSchema: null,
  getRenderType: () => 'datetime',
  async getResult() {
    return new Date()
  }
}
