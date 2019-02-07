export default function(datasets, sortXAxisValues) {
  let newDatasets = {...datasets}

  if (sortXAxisValues === 'textAsc') {
    for (const dataset in datasets) {
      const datasetReplica = datasets[dataset]
      const sortedDataset = datasetReplica.sort((a, b) => {
        if (a.x.toLowerCase() < b.x.toLowerCase()) return -1
        if (a.x.toLowerCase() > b.x.toLowerCase()) return 1
        return 0
      })
      newDatasets[dataset] = sortedDataset
    }
  }
  if (sortXAxisValues === 'textDesc') {
    for (const dataset in datasets) {
      const datasetReplica = datasets[dataset]
      const sortedDataset = datasetReplica.sort((a, b) => {
        if (b.x.toLowerCase() < a.x.toLowerCase()) return -1
        if (b.x.toLowerCase() > a.x.toLowerCase()) return 1
        return 0
      })
      newDatasets[dataset] = sortedDataset
    }
  }
  if (sortXAxisValues === 'numAsc') {
    for (const dataset in datasets) {
      const datasetReplica = datasets[dataset]
      const sortedDataset = datasetReplica.sort((a, b) => a.x - b.x)
      newDatasets[dataset] = sortedDataset
    }
  }
  if (sortXAxisValues === 'numDesc') {
    for (const dataset in datasets) {
      const datasetReplica = datasets[dataset]
      const sortedDataset = datasetReplica.sort((a, b) => b.x - a.x)
      newDatasets[dataset] = sortedDataset
    }
  }

  return newDatasets
}
