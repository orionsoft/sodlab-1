import submitForm from 'app/resolvers/Forms/submitForm'

export default async function({endpoint, parameters}) {
  const item = await submitForm({formId: endpoint.formId, ...parameters})
  return {
    _id: item._id,
    ...item.data
  }
}
