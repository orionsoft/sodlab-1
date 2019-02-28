// https://github.com/LibreDTE/libredte-lib/tree/master/examples/json/33
// http://www.sii.cl/factura_electronica/formato_dte.pdf
import moment from 'moment-timezone'
import slug from 'slug'
import Collections from 'app/collections/Collections'
import Filters from 'app/collections/Filters'
import Environments from 'app/collections/Environments'
import {hookStart, throwHookError} from '../../helpers'
import {
  getDteAdminInfo,
  postEmitTempDte,
  postCreateDte,
  getUpdateDte,
  getTedOfADte,
  getPdfOfADte
} from 'app/services/libreDte/endpoints'
import {deliveryDTEs} from 'app/services/libreDte/config'
import s3 from 'app/services/aws/s3'
import {checkField} from '../helpers'

export default {
  name: 'Libre DTE: Emitir Factura Electrónica o Factura Electrónica Exenta o no Afecta',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    itemId: {
      type: String,
      label: '(opcional) Id del item. Por defecto se utilizará el ID del último documento',
      optional: true
    },
    apiKey: {
      type: String,
      label: 'API key de la app de LibreDTE'
    },
    dte: {
      label: 'Tipo de DTE',
      type: String,
      fieldType: 'select',
      fieldOptions: {options: deliveryDTEs}
    },
    TipoDespacho: {
      label: '(Opcional) Tipo de Despacho',
      type: Number,
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: '1. Despacho por cuenta del receptor del documento', value: 1},
          {label: '2. Despacho por cuenta del emisor a instalaciones del cliente', value: 2},
          {label: '3. Despacho por cuenta del emisor a otras instalaciones', value: 3}
        ]
      },
      optional: true
    },
    IndTraslado: {
      label: 'Tipo de Traslado de Bienes',
      type: Number,
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Operación constituye venta', value: 1},
          {label: 'Ventas por efectuar', value: 2},
          {label: 'Consignciones', value: 3},
          {label: 'Entrega gratuita', value: 4},
          {label: 'Traslados internos', value: 5},
          {label: 'Otros traslados no venta', value: 6},
          {label: 'Guía de devolución', value: 7},
          {label: 'Traslado para exportación (no venta)', value: 8},
          {label: 'Venta para exportación', value: 9}
        ]
      }
    },
    FmaPago: {
      label: '(opcional) Forma de pago',
      type: String,
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Contado', value: '1'},
          {label: 'Crédito', value: '2'},
          {label: 'Sin costo (entrega gratuita)', value: '3'}
        ]
      },
      optional: true
    },
    TermPagoGlosa: {
      label: '(opcional) Glosa',
      type: String,
      fieldType: 'textArea',
      optional: true
    },
    issuerRut: {
      label: 'Rut del Emisor',
      type: String
    },
    issuerBusinessName: {
      label: 'Razón social del Emisor',
      type: String
    },
    issuerLineOfBusiness: {
      label: 'Giro comercial o Línea de negocio Emisor',
      type: String
    },
    issuerSiiActivityCode: {
      label: 'Código de actividad económica del Emisor',
      type: Number
    },
    issuerAddressOfOrigin: {
      label: 'Dirección de origen del Emisor (Ej: Cerro el plomo 5931, of 510)',
      type: String
    },
    issuerCommuneOfOrigin: {
      label: 'Comuna de origen del Emisor (Ej: Las Condes)',
      type: String
    },
    recipientCollectionId: {
      label: 'Colección para buscar al receptor',
      type: String,
      fieldType: 'collectionSelect'
    },
    recipientId: {
      label: 'Id para buscar al receptor en la colección del receptor',
      type: String
    },
    recipientRut: {
      label: 'Rut del Receptor',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'recipientCollectionId'
    },
    recipientBusinessName: {
      label: 'Razón social del Receptor',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'recipientCollectionId'
    },
    recipientLineOfBusiness: {
      label: 'Giro comercial o Línea de negocio Receptor',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'recipientCollectionId'
    },
    recipientAddressOfOrigin: {
      label: 'Dirección de origen del Receptor (Ej: Cerro el plomo 5931, of 510)',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'recipientCollectionId'
    },
    recipientCommuneOfOrigin: {
      label: 'Comuna de origen del Receptor (Ej: Las Condes)',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'recipientCollectionId'
    },
    Patente: {
      label: '(opcional) Relevante si el indicador de tipo de despacho es 2 o 3',
      type: String,
      optional: true
    },
    rutTrans: {
      label:
        '(opcional) Rut transportista. Relevante si el indicador de tipo de despacho es 2 o 3. Con guión y dígito verificador.',
      type: String,
      optional: true
    },
    rutChofer: {
      label:
        '(opcional) Rut chofer que realiza el transporte de mercancias. Con guión y dígito verificador.',
      type: String,
      optional: true
    },
    NombreChofer: {
      label: '(opcional) Nombre del chofer que realiza el transporte de mercancias',
      type: String,
      optional: true
    },
    DirDest: {
      label:
        'Dirección de destino. Datos correspondientes a Dirección destino en documento que acompaña productos o a la Dirección en que se otorga el servicio en caso de Servicios periódicos. Aplica si el destino esdistinto de Dirección Receptor, o de Dirección Emisor en el caso de Factura de Compra',
      type: String
    },
    CmnaDest: {
      label: 'Comuna de destino. Idem anterior',
      type: String
    },
    CiudadDest: {
      label: '(opcional) Ciudad de destino. Idem anterior',
      type: String,
      optional: true
    },
    productsCollectionId: {
      label: 'Colección a la que pertenecen los items que se incluiran DTE',
      type: String,
      fieldType: 'collectionSelect'
    },
    filterId: {
      label: 'Filtro para obtener los productos',
      type: String,
      fieldType: 'filterSelect'
    },
    filterParams: {
      label:
        '(opcional) Entregar y/o renombrar parámetros que se le entregan al filtro. Por defecto recibe todos los valores del item.',
      type: String,
      fieldType: 'textArea',
      defaultValue: '{}',
      optional: true
    },
    nmbItemField: {
      label: 'Campo del nombre del item',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'productsCollectionId'
    },
    qtyItemField: {
      label: 'Campo de cantidad del item',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'productsCollectionId'
    },
    prcItemField: {
      label: 'Campo de precio del item',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'productsCollectionId'
    },
    folioField: {
      label: 'Campo en donde guardar el folio del DTE',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collectionId'
    },
    statusField: {
      label: 'Campo en donde guardar el estado del DTE despues de verificarlo contra el SII',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collectionId'
    },
    tedField: {
      label: 'Campo en donde guardar la imagen del Timbre Electrónico emitido por el SII',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collectionId'
    },
    pdfField: {
      label: '(opcional) Campo en donde guardar el PDF generado por LibreDTE',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collectionId',
      optional: true
    }
  },
  async execute({
    options: {
      collectionId,
      itemId,
      apiKey,
      dte,
      TipoDespacho,
      IndTraslado,
      FmaPago,
      TermPagoGlosa,
      issuerRut,
      issuerBusinessName,
      issuerLineOfBusiness,
      issuerSiiActivityCode,
      issuerAddressOfOrigin,
      issuerCommuneOfOrigin,
      recipientCollectionId,
      recipientId,
      recipientRut,
      recipientBusinessName,
      recipientLineOfBusiness,
      recipientAddressOfOrigin,
      recipientCommuneOfOrigin,
      Patente,
      rutTrans,
      rutChofer,
      NombreChofer,
      DirDest,
      CmnaDest,
      CiudadDest,
      productsCollectionId,
      filterId,
      filterParams,
      nmbItemField,
      qtyItemField,
      prcItemField,
      folioField,
      statusField,
      tedField,
      pdfField
    },
    environmentId,
    userId,
    hook,
    hooksData,
    viewer
  }) {
    const {timezone} = await Environments.findOne(environmentId)
    const timestamp = moment()
      .tz(timezone)
      .format('YYYY-MM-DD_kk:mm:ss')
    const {shouldThrow} = hook

    try {
      const item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
      const rutEmisorWithoutDots = issuerRut.replace(/\./g, '')
      const rutEmisorWithoutDotsAndDash = rutEmisorWithoutDots.includes('-')
        ? rutEmisorWithoutDots.split('-')[0]
        : rutEmisorWithoutDots
      const infoEmisor = await getDteAdminInfo(apiKey, dte, rutEmisorWithoutDotsAndDash)
      const IdDoc = {
        TipoDTE: parseInt(dte, 10),
        Folio: infoEmisor.siguiente,
        IndTraslado
      }
      if (TipoDespacho) IdDoc.TipoDespacho = TipoDespacho
      if (FmaPago) IdDoc.FmaPago = FmaPago
      if (TermPagoGlosa) IdDoc.TermPagoGlosa = TermPagoGlosa
      const Emisor = {
        RUTEmisor: rutEmisorWithoutDots,
        RznSoc: issuerBusinessName,
        GiroEmis: issuerLineOfBusiness,
        Acteco: issuerSiiActivityCode,
        DirOrigen: issuerAddressOfOrigin,
        CmnaOrigen: issuerCommuneOfOrigin
      }
      const recipientCollection = await Collections.findOne(recipientCollectionId)
      const recipientDb = await recipientCollection.db()
      const recipient = await recipientDb.findOne(recipientId)
      const rutReceptor = recipient.data[recipientRut]
      const rutReceptorWithoutDots = rutReceptor.replace(/\./g, '')
      const Receptor = {
        RUTRecep: rutReceptorWithoutDots,
        RznSocRecep: recipient.data[recipientBusinessName],
        GiroRecep: recipient.data[recipientLineOfBusiness],
        DirRecep: recipient.data[recipientAddressOfOrigin],
        CmnaRecep: recipient.data[recipientCommuneOfOrigin]
      }
      let Transporte = {
        Patente,
        DirDest,
        CmnaDest,
        CiudadDest
      }
      if (rutTrans) Transporte.RUTTrans = RUTTrans
      if (rutChofer) Transporte.RUTChofer = RUTChofer
      if (NombreChofer) Transporte.NombreChofer = NombreChofer
      if (CiudadDest) Transporte.CiudadDest = CiudadDest
      const Encabezado = {
        IdDoc,
        Emisor,
        Receptor,
        Transporte
      }
      const productsCollection = await Collections.findOne(productsCollectionId)
      const productsDb = await productsCollection.db()
      const filter = await Filters.findOne(filterId)
      let filterOptions = {_id: item._id, ...item.data}
      const filterUserParams = JSON.parse(filterParams)
      for (const key in filterUserParams) {
        const userParam = filterUserParams[key]
        if (Object.keys(filterOptions).includes(userParam)) {
          filterOptions[key] = filterOptions[userParam]
        } else {
          filterOptions[key] = userParam
        }
      }
      const query = await filter.createQuery({filterOptions})
      const items = await productsDb.find(query).toArray()
      const fields = productsCollection.fields.map(field => field.name)
      const collectionFields = ['_id', ...fields]
      const Detalle = items.map(item => {
        const {data} = item
        const NmbItem = checkField(collectionFields, data, nmbItemField, 'string')
        const QtyItem = checkField(collectionFields, data, qtyItemField, 'string', '0')
        const PrcItem = checkField(collectionFields, data, prcItemField, 'string', '1')
        return {
          NmbItem,
          QtyItem,
          PrcItem
        }
      })
      const body = {
        Encabezado,
        Detalle
      }
      console.log({
        level: 'INFO',
        message: `Emitting a temporary DTE from emisor: ${rutEmisorWithoutDots} to receptor: ${rutReceptorWithoutDots} using the folio: ${
          IdDoc.Folio
        }`,
        ...body,
        hookName: hook.name,
        environmentId,
        userId,
        timestamp
      })
      const tempDte = await postEmitTempDte(apiKey, body)
      const realDte = await postCreateDte(
        apiKey,
        tempDte.emisor,
        tempDte.receptor,
        tempDte.dte,
        tempDte.codigo
      )
      const updatedDte = await getUpdateDte(apiKey, realDte.dte, realDte.folio, realDte.emisor)
      console.log({
        level: 'INFO',
        message: `Updated the DTE with folio: ${realDte.folio}, from: ${realDte.emisor}`,
        ...updatedDte,
        hookName: hook.name,
        environmentId,
        userId,
        timestamp
      })
      const ted = await getTedOfADte(apiKey, realDte.dte, realDte.folio, realDte.emisor)
      const Bucket = process.env.AWS_S3_BUCKETNAME
      const dteLabel = billDTEs.filter(doc => doc.value == realDte.dte)[0].label
      const Key = `sii/${environmentId}/${realDte.emisor}/${slug(realDte.dte + '-' + dteLabel)}/${
        realDte.folio
      }/ted/${timestamp}.png`
      const params = {
        Body: ted.data,
        Bucket,
        Key,
        ContentEncoding: 'base64',
        ContentType: 'image/png'
      }
      await s3.putObject(params)
      const tedUrl = `https://s3.amazonaws.com/${Bucket}/${Key}`
      console.log({
        level: 'INFO',
        message: `Uploaded the TED of the DTE with folio: ${realDte.folio}, from: ${
          realDte.emisor
        }`,
        tedUrl,
        hookName: hook.name,
        environmentId,
        userId,
        timestamp
      })
      if (pdfField) {
        const pdf = await getPdfOfADte(apiKey, realDte.dte, realDte.folio, realDte.emisor)
        const pdfKey = `sii/${environmentId}/${realDte.emisor}/${slug(
          realDte.dte + '-' + dteLabel
        )}/${realDte.folio}/pdf/${timestamp}.pdf`
        const pdfParams = {
          Body: pdf.data,
          Bucket,
          Key: pdfKey,
          ContentEncoding: 'base64',
          ContentType: 'application/pdf'
        }
        await s3.putObject(pdfParams)
        const pdfUrl = `https://s3.amazonaws.com/${Bucket}/${pdfKey}`
        console.log({
          level: 'INFO',
          message: `Uploaded the PDF of the DTE with folio: ${realDte.folio}, from: ${
            realDte.emisor
          }`,
          pdfUrl,
          hookName: hook.name,
          environmentId,
          userId,
          timestamp
        })
        await item.update({
          $set: {
            [`data.${folioField}`]: realDte.folio,
            [`data.${tedField}`]: tedUrl,
            [`data.${pdfField}`]: pdfUrl,
            [`data.${statusField}`]: updatedDte.revision_estado
          }
        })
        return {start: item, result: item, success: true}
      }
      await item.update({
        $set: {
          [`data.${folioField}`]: realDte.folio,
          [`data.${tedField}`]: tedUrl,
          [`data.${statusField}`]: updatedDte.revision_estado
        }
      })
      return {start: item, result: item, success: true}
    } catch (err) {
      console.log('err', err)
      console.log({
        level: 'ERROR',
        err: err.toString(),
        message: 'An error ocurred when creating a bill',
        hookName: hook.name,
        environmentId,
        userId,
        timestamp
      })
      return throwHookError(err)
    }
  }
}
