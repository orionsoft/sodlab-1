import moment from 'moment-timezone'

export default function(datasets, dateFormatXAxisValues, timezone = 'America/Santiago') {
  if (!dateFormatXAxisValues) return datasets

  let newDataset = {}
  for (const dataset in datasets) {
    const data = datasets[dataset].map(point => ({
      x: moment(point.x)
        .tz(timezone)
        .format(dateFormatXAxisValues),
      y: point.y
    }))
    newDataset = {...newDataset, [dataset]: data}
  }
  return newDataset
}
