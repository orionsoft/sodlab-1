import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default function({sourceItem, template, userId, environmentId}) {
  return new Promise(async (resolve, reject) => {
    const user = await EnvironmentUsers.findOne({userId, environmentId}).catch(err => {
      console.log('Hook Create/Update doc failed because the user was not found')
      reject({success: false})
    })

    let data = {}

    Object.keys(template).map(async sourceField => {
      const fieldSchema = template[sourceField]
      let value
      if (sourceField === '_id') {
        value = sourceItem._id
      } else if (sourceField.includes('user_')) {
        const parsedUserField = sourceField.replace('user_', '')
        value = user.profile[parsedUserField]
      } else {
        if (fieldSchema.type === 'fixed') {
          value = fieldSchema.value
        } else if (fieldSchema.type === 'param') {
          value = sourceItem.data[sourceField]
        } else {
          console.log(
            `Hook Create/Update doc received a non valid field type for the source field ${sourceField}`
          )
          return reject({success: false})
        }
      }
      data = {...data, [fieldSchema.field]: value}
    })

    resolve(data)
  })
}
