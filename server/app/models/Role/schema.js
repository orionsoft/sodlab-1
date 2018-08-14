import Roles from 'app/collections/Roles'
export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  name: {
    type: String,
    label: 'Nombre de Rol',
    description: 'Solo puede haber un rol con este nombre',
    async custom(name, {doc}) {
      if (doc.roleId) {
        const role = await Roles.findOne(doc.roleId)
        const result = await Roles.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: role.environmentId
        })
        if (result && role._id !== result._id) return 'notUnique'
      }
    }
  },
  createdAt: {
    type: Date
  }
}
