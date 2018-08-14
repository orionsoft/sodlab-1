import isEmpty from 'lodash/isEmpty'
import Indicators from 'app/collections/Indicators'

export default {
  _id: {
    type: 'ID'
  },
  name: {
    type: String,
    label: 'Nombre',
    description: 'Solo puede haber un indicador con este nombre',
    async custom(name, {doc}) {
      if (doc.indicatorId) {
        const indicator = await Indicators.findOne(doc.indicatorId)
        const result = await Indicators.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: indicator.environmentId
        })
        if (result && indicator._id !== result._id) return 'notUnique'
      }
    }
  },
  title: {
    type: String,
    label: 'Título'
  },
  environmentId: {
    type: 'ID'
  },
  createdAt: {
    type: Date
  },
  collectionId: {
    type: 'ID',
    optional: true
  },
  fieldName: {
    type: String,
    optional: true
  },
  filtersIds: {
    type: [String],
    optional: true,
    async custom(filtersIds, {currentDoc}) {
      if (isEmpty(filtersIds) && !currentDoc.allowsNoFilter) {
        return 'needFilter'
      }
    }
  },
  allowsNoFilter: {
    type: Boolean,
    defaultValue: true,
    async custom(allowsNoFilter, {currentDoc}) {
      if (!allowsNoFilter && isEmpty(currentDoc.filtersIds)) {
        return 'needFilter'
      }
    }
  },
  indicatorTypeId: {
    type: String,
    optional: true
  },
  options: {
    type: 'blackbox',
    optional: true
  },
  orderFiltersByName: {
    type: Boolean,
    optional: true
  }
}
