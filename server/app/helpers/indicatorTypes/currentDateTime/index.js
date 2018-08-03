export default {
  name: 'Fecha con Hora actual',
  requireCollection: false,
  requireField: false,
  optionsSchema: null,
  getRenderType: () => 'datetime',
  async getResult() {
    return new Date()
  }
}
