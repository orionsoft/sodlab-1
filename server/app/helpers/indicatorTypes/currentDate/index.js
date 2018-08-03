export default {
  name: 'Fecha actual',
  requireCollection: false,
  requireField: false,
  optionsSchema: null,
  getRenderType: () => 'date',
  async getResult() {
    return new Date()
  }
}
