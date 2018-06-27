import Views from 'app/collections/Views'

export default async function(tableId) {
  await Views.update(
    {items: {$elemMatch: {tableId: tableId}}},
    {$pull: {items: {tableId: tableId}}},
    {multi: true}
  )
  return true
}
