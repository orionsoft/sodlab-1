import Views from 'app/collections/Views'
import {resolver} from '@orion-js/app'
import View from 'app/models/View'

export default resolver({
  params: {
    viewId: {
      type: 'ID'
    },
    view: {
      type: View.clone({
        name: 'UpdateView',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: View,
  mutation: true,
  role: 'admin',
  async resolve({viewId, view: viewData}, viewer) {
    const fields = ['title']
    fields.map(field => {
      if (!viewData.hasOwnProperty(field)) {
        viewData[field] = null
      }
    })
    const view = await Views.findOne(viewId)
    await view.update({$set: viewData})
    return view
  }
})
