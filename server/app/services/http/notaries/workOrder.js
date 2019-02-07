import {route} from '@orion-js/app'
import Collections from 'app/collections/Collections'

route('/notaries/:environmentId/work-order/:workOrderId', async function({params, getBody}) {
  const {environmentId, workOrderId} = params
  try {
    console.log({
      message: '@@@ Sodlab Printer App: Request received',
      params: {environmentId, workOrderId},
      serverTime: new Date()
    })

    const body = await getBody()
    const {retencion: retention} = JSON.parse(body)
    const retentionPercentage = retention ? parseFloat(retention) : null

    const ordenesCollectionId = `${environmentId}_ordenes`
    const ordenesCol = await Collections.findOne(ordenesCollectionId)
    const ordenesDb = await ordenesCol.db()
    const workOrder = await ordenesDb.findOne(workOrderId)
    if (!workOrder) {
      console.log({
        message: '@@@ Sodlab Printer App: Failed to find the work order',
        workOrderId,
        environmentId,
        serverTime: new Date()
      })

      return {
        succes: false,
        message: 'Work order not found'
      }
    }
    console.log({
      message: '@@@ Sodlab Printer App: Aggregating data to print',
      workOrderId,
      workOrderNumber: workOrder.data.numeroOt,
      environmentId,
      serverTime: new Date()
    })

    const informacionimpresoraotColletionId = `${environmentId}_informacionimpresoraot`
    const informacionimpresoraotCol = await Collections.findOne(informacionimpresoraotColletionId)
    const informacionimpresoraotDb = await informacionimpresoraotCol.db()
    const infoImpresora = await informacionimpresoraotDb.find({}).toArray()

    const materiasCollectionId = `${environmentId}_materias`
    const materiasCol = await Collections.findOne(materiasCollectionId)
    const materiasDb = await materiasCol.db()

    const cobrosCollectionId = `${environmentId}_cobros`
    const cobrosCol = await Collections.findOne(cobrosCollectionId)
    const cobrosDb = await cobrosCol.db()

    const tramitesCollectionId = `${environmentId}_tramites`
    const tramitesCol = await Collections.findOne(tramitesCollectionId)
    const tramitesDb = await tramitesCol.db()
    const tramites = await tramitesDb.find({'data.otId': workOrderId}).toArray()

    const productList = tramites.map(async tramite => {
      const materia = await materiasDb.findOne(tramite.data.materiaId)
      const cobrosDN = await cobrosDb
        .find({'data.tramiteId': tramite._id, 'data.nombreTipoCobro': 'Derechos Notariales'})
        .toArray()
      const sumaDerechosNotariales = cobrosDN.reduce((acc, cobro) => acc + cobro.data.montoCLP, 0)

      const cobrosTerceros = await cobrosDb
        .find({'data.tramiteId': tramite._id, 'data.categoriaTipoCobro': 'Terceros'})
        .toArray()
      const sumaTerceros = cobrosTerceros.reduce((acc, cobro) => acc + cobro.data.montoCLP, 0)

      const cobrosImpuestos = await cobrosDb
        .find({'data.tramiteId': tramite._id, 'data.categoriaTipoCobro': 'Impuesto'})
        .toArray()
      const sumaImpuestos = cobrosImpuestos.reduce((acc, cobro) => acc + cobro.data.montoCLP, 0)

      return {
        nombre: materia.data.nombre,
        derechosNotariales: Math.trunc(sumaDerechosNotariales, 0),
        terceros: Math.trunc(sumaTerceros, 0),
        impuestos: Math.trunc(sumaImpuestos, 0)
      }
    })

    const products = await Promise.all(productList)
    const totalDerechosNotariales = products.reduce(
      (acc, product) => acc + product.derechosNotariales,
      0
    )
    const totalTerceros = products.reduce((acc, product) => acc + product.terceros, 0)
    const totalImpuestos = products.reduce((acc, product) => acc + product.impuestos, 0)
    const totalOtrosCobros = totalTerceros + totalImpuestos
    const retencion = retention ? Math.trunc(totalDerechosNotariales * retentionPercentage) : false
    const totalBoleta = retention ? totalDerechosNotariales + retencion : false
    const totalGeneral = retention
      ? totalBoleta + totalOtrosCobros
      : totalDerechosNotariales + totalOtrosCobros

    const result = {
      otId: workOrder.data.numeroOt,
      nombreFuncionario: workOrder.data.nombreFuncionario,
      nombreCompleto: workOrder.data.nombreCliente,
      rutCliente: workOrder.data.numeroDocumentoCliente,
      materias: products,
      totalDerechosNotariales,
      totalTerceros,
      totalImpuestos,
      totalOtrosCobros,
      retencion,
      totalBoleta,
      totalGeneral,
      infoImpresora: {...infoImpresora[0].data}
    }

    console.log({
      message: '@@@ Sodlab Printer App: Succesfully aggregated the data',
      workOrderId,
      workOrderNumber: workOrder.data.numeroOt,
      environmentId,
      serverTime: new Date()
    })

    return result
  } catch (err) {
    console.log({
      message: '@@@ Sodlab Printer App: An error ocurred trying to get the data to print',
      err: err.toString(),
      workOrderId,
      environmentId,
      serverTime: new Date()
    })
  }
})
