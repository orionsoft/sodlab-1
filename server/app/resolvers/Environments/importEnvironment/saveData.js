import Charts from 'app/collections/Charts'
import Collections from 'app/collections/Collections'
import Filters from 'app/collections/Filters'
import Forms from 'app/collections/Forms'
import Hooks from 'app/collections/Hooks'
import Indicators from 'app/collections/Indicators'
import Links from 'app/collections/Links'
import Roles from 'app/collections/Roles'
import Tables from 'app/collections/Tables'
import Views from 'app/collections/Views'
import Environments from 'app/collections/Environments'
import Endpoints from 'app/collections/Endpoints'
import Buttons from 'app/collections/Buttons'
import Validations from 'app/collections/Validations'

export default async function(environment, data) {
  const environmentId = environment._id
  await Environments.update(environmentId, {$set: {profileFields: data.environment.profileFields}})

  for (const item of data.buttons) {
    await Buttons.insert(item)
  }
  for (const item of data.charts) {
    await Charts.insert(item)
  }
  for (const item of data.collections) {
    await Collections.insert(item)
  }
  for (const item of data.endpoints) {
    await Endpoints.insert(item)
  }
  for (const item of data.filters) {
    await Filters.insert(item)
  }
  for (const item of data.forms) {
    await Forms.insert(item)
  }
  for (const item of data.hooks) {
    await Hooks.insert(item)
  }
  for (const item of data.indicators) {
    await Indicators.insert(item)
  }
  for (const item of data.links) {
    await Links.insert(item)
  }
  for (const item of data.roles) {
    await Roles.insert(item)
  }
  for (const item of data.tables) {
    await Tables.insert(item)
  }
  for (const item of data.validations) {
    await Validations.insert(item)
  }
  for (const item of data.views) {
    await Views.insert(item)
  }
}
