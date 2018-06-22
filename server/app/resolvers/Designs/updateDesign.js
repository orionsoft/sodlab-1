import {resolver} from '@orion-js/app'
import Design from 'app/models/Design'
import Designs from 'app/collections/Designs'

export default resolver({
  params: {
    designId: {
      type: 'ID'
    },
    design: {
      type: Design.clone({
        name: 'UpdateDesign',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: Design,
  mutation: true,
  role: 'admin',
  async resolve({designId, design: designData}, viewer) {
    const design = await Designs.findOne(designId)
    await design.update({$set: designData})
    return design
  }
})
