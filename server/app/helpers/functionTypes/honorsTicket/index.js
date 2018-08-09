import Collections from 'app/collections/Collections'
import Environments from 'app/collections/Environments'
import formatDate from 'app/helpers/misc/formatDate'
import DTEEmission from 'app/helpers/functionTypes/helpers/DTEEmission'
import clean from 'app/helpers/fieldTypes/rut/clean'
import uploadPDF from 'app/helpers/functionTypes/helpers/uploadPDF'

const fields = [
  'collectionId',
  'date',
  'retention',
  'receptorId',
  'productsIds',
  'productsCollectionId',
  'clientsCollectionId',
  'receptorRut',
  'receptorRs',
  'receptorComuna',
  'receptorDirection',
  'productsName',
  'productsPrice'
]

export default {
  name: 'Emitir Boleta de Honorarios',
  optionsSchema: {
    collectionId: {
      label: 'Colección Boletas de Honorarios',
      type: String,
      fieldType: 'collectionSelect'
    },
    date: {
      type: String,
      label: 'Fecha (desde formulario)',
      fieldType: 'collectionFieldSelect'
    },
    retention: {
      type: String,
      label: 'Retención (desde formulario)',
      fieldType: 'collectionFieldSelect'
    },
    clientsCollectionId: {
      type: String,
      label: 'Colección de Clientes',
      fieldType: 'collectionSelect'
    },
    receptorId: {
      type: String,
      label: 'Identificador Cliente (desde formulario)',
      fieldType: 'collectionFieldSelect'
    },
    receptorRut: {
      type: String,
      label: 'Campo RUT Cliente (de colección Cliente)',
      fieldType: 'collectionFieldSelect'
    },
    receptorRs: {
      type: String,
      label: 'Campo Razón Social Cliente (de colección Cliente)',
      fieldType: 'collectionFieldSelect'
    },
    receptorComuna: {
      type: String,
      label: 'Campo Comuna Cliente (de colección Cliente)',
      fieldType: 'collectionFieldSelect'
    },
    receptorDirection: {
      type: String,
      label: 'Campo Dirección Cliente (de colección Cliente)',
      fieldType: 'collectionFieldSelect'
    },
    productsCollectionId: {
      type: String,
      label: 'Colección de Productos',
      fieldType: 'collectionSelect'
    },
    productsIds: {
      type: [String],
      label: 'Identificador Producto (desde formulario)',
      fieldType: 'collectionFieldSelect'
    },
    productsName: {
      type: String,
      label: 'Campo Nombre Productos (de colección Productos)',
      fieldType: 'collectionFieldSelect'
    },
    productsPrice: {
      type: String,
      label: 'Campo Precio Productos (de colección Productos)',
      fieldType: 'collectionFieldSelect'
    },
    ticketPdf: {
      type: String,
      label: 'Campo para almacenar pdf (de colección Boletas)',
      fieldType: 'collectionFieldSelect'
    },
    ticketIdDoc: {
      type: String,
      label: 'Campo para almacenar id de documento (de colección Boletas)',
      fieldType: 'collectionFieldSelect'
    }
  },
  async execute({options: params, itemId}) {
    console.log({options: params, itemId})
    fields.map(field => {
      if (!params.hasOwnProperty(field)) {
        throw new Error('Información faltante')
      }
    })

    const collection = await Collections.findOne(params.collectionId)
    const environment = await Environments.findOne({_id: collection.environmentId})
    const {liorenId} = environment
    if (!liorenId) throw new Error('No hay ID de Lioren para emisión de documentos')

    const clientsCol = await Collections.findOne(params.clientsCollectionId)
    const productsCol = await Collections.findOne(params.productsCollectionId)

    const clientsDB = await clientsCol.db()
    const productsDB = await productsCol.db()

    const client = await clientsDB.findOne(params.receptorId)

    const promises = params.productsIds.map(async productId => {
      return await productsDB.findOne(productId)
    })
    const products = await Promise.all(promises)
    const productsList = products.map(product => {
      return {
        nombre: product.data[params.productsName],
        precio: parseInt(product.data[params.productsPrice])
      }
    })

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + liorenId,
        'Content-Type': 'application/json'
      },
      body: {
        fecha: formatDate(params.date),
        retencion: params.retention,
        receptor: {
          rut: clean(client.data[params.receptorRut]),
          rs: client.data[params.receptorRs],
          comuna: client.data[params.receptorComuna],
          direccion: client.data[params.receptorDirection]
        },
        detalles: productsList,
        expects: 'all'
      }
    }

    console.log(JSON.stringify(options, undefined, 4))

    // const dte = await DTEEmission(options, 'https://lioren.cl/api/bhe')
    const dte = {
      id: '2exA8d',
      folio: 43,
      retencion: 'receptor',
      totalhonorario: 4,
      totalretencion: 0.4,
      totalpago: 4,
      barcode: '16688583000432E31992',
      pdf:
        'JVBERi0xLjMKJeLjz9MKMSAwIG9iajw8L0ZpbHRlci9TdGFuZGFyZC9PPDRkNmZkZTc2ZWJjNzU0ZTIwZDcyOGFkODk0MGNkMzUxMTk5YjQxYzQwMmJhZTE3ZGM1N2JlNGIzNmM0MTllMjk+L1U8YTIwMjMzZjIwNTM4MGQ3OGZiNzMzOTNhOGU0ZjAxNWI1YzUzYWE0NjdhOTY3YWJiOTMxZTUyY2I0OGNkZjU2Nz4vUCAtNjAvViAxL1IgMj4+ZW5kb2JqCjIgMCBvYmo8PC9Qcm9kdWNlcjw3NGI2NmI3YzRlZGM5N2FmZjIwNzlkYWFiNTA1Zjc5NzJhNThmNGU2YzRlYWEyNjY2MjBjMTc1OWI2OWE0MmJhN2NmY2MwOWNkNmExMjVkNTgzZGJkNzZhNjE4NDc3NjNmZTQxNWY4MjVjZTkyMjgwMjhlZjc4MmMyNTZmYTNhN2EzZDU1ODdmNTRiOWQ1YjRhNTU0NDk4NGEyYzIzYT4vQ3JlYXRpb25EYXRlPDU4ZjgzNDIwMWI4YmM0YjdmMzEwOTRiNGIzMDVlNmU3NjgxOGI5YTQ5ZD4+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9FbmNvZGluZy9EaWZmZXJlbmNlc1sgMzIvc3BhY2UvZXhjbGFtL3F1b3RlZGJsL251bWJlcnNpZ24vZG9sbGFyL3BlcmNlbnQvYW1wZXJzYW5kL3F1b3Rlc2luZ2xlL3BhcmVubGVmdC9wYXJlbnJpZ2h0L2FzdGVyaXNrL3BsdXMvY29tbWEvbWludXMvcGVyaW9kL3NsYXNoL3plcm8vb25lL3R3by90aHJlZS9mb3VyL2ZpdmUvc2l4L3NldmVuL2VpZ2h0L25pbmUvY29sb24vc2VtaWNvbG9uL2xlc3MvZXF1YWwvZ3JlYXRlci9xdWVzdGlvbi9hdC9BL0IvQy9EL0UvRi9HL0gvSS9KL0svTC9NL04vTy9QL1EvUi9TL1QvVS9WL1cvWC9ZL1ovYnJhY2tldGxlZnQvYmFja3NsYXNoL2JyYWNrZXRyaWdodC9hc2NpaWNpcmN1bS91bmRlcnNjb3JlL2dyYXZlL2EvYi9jL2QvZS9mL2cvaC9pL2ovay9sL20vbi9vL3AvcS9yL3MvdC91L3Yvdy94L3kvei9icmFjZWxlZnQvYmFyL2JyYWNlcmlnaHQvYXNjaWl0aWxkZSAxMjgvRXVybyAxMzAvcXVvdGVzaW5nbGJhc2UvZmxvcmluL3F1b3RlZGJsYmFzZS9lbGxpcHNpcy9kYWdnZXIvZGFnZ2VyZGJsL2NpcmN1bWZsZXgvcGVydGhvdXNhbmQvU2Nhcm9uL2d1aWxzaW5nbGxlZnQvT0UgMTQ1L3F1b3RlbGVmdC9xdW90ZXJpZ2h0L3F1b3RlZGJsbGVmdC9xdW90ZWRibHJpZ2h0L2J1bGxldC9lbmRhc2gvZW1kYXNoL3RpbGRlL3RyYWRlbWFyay9zY2Fyb24vZ3VpbHNpbmdscmlnaHQvb2UgMTU5L1lkaWVyZXNpcy9zcGFjZS9leGNsYW1kb3duL2NlbnQvc3RlcmxpbmcvY3VycmVuY3kveWVuL2Jyb2tlbmJhci9zZWN0aW9uL2RpZXJlc2lzL2NvcHlyaWdodC9vcmRmZW1pbmluZS9ndWlsbGVtb3RsZWZ0L2xvZ2ljYWxub3QvaHlwaGVuL3JlZ2lzdGVyZWQvbWFjcm9uL2RlZ3JlZS9wbHVzbWludXMvdHdvc3VwZXJpb3IvdGhyZWVzdXBlcmlvci9hY3V0ZS9tdS9wYXJhZ3JhcGgvcGVyaW9kY2VudGVyZWQvY2VkaWxsYS9vbmVzdXBlcmlvci9vcmRtYXNjdWxpbmUvZ3VpbGxlbW90cmlnaHQvb25lcXVhcnRlci9vbmVoYWxmL3RocmVlcXVhcnRlcnMvcXVlc3Rpb25kb3duL0FncmF2ZS9BYWN1dGUvQWNpcmN1bWZsZXgvQXRpbGRlL0FkaWVyZXNpcy9BcmluZy9BRS9DY2VkaWxsYS9FZ3JhdmUvRWFjdXRlL0VjaXJjdW1mbGV4L0VkaWVyZXNpcy9JZ3JhdmUvSWFjdXRlL0ljaXJjdW1mbGV4L0lkaWVyZXNpcy9FdGgvTnRpbGRlL09ncmF2ZS9PYWN1dGUvT2NpcmN1bWZsZXgvT3RpbGRlL09kaWVyZXNpcy9tdWx0aXBseS9Pc2xhc2gvVWdyYXZlL1VhY3V0ZS9VY2lyY3VtZmxleC9VZGllcmVzaXMvWWFjdXRlL1Rob3JuL2dlcm1hbmRibHMvYWdyYXZlL2FhY3V0ZS9hY2lyY3VtZmxleC9hdGlsZGUvYWRpZXJlc2lzL2FyaW5nL2FlL2NjZWRpbGxhL2VncmF2ZS9lYWN1dGUvZWNpcmN1bWZsZXgvZWRpZXJlc2lzL2lncmF2ZS9pYWN1dGUvaWNpcmN1bWZsZXgvaWRpZXJlc2lzL2V0aC9udGlsZGUvb2dyYXZlL29hY3V0ZS9vY2lyY3VtZmxleC9vdGlsZGUvb2RpZXJlc2lzL2RpdmlkZS9vc2xhc2gvdWdyYXZlL3VhY3V0ZS91Y2lyY3VtZmxleC91ZGllcmVzaXMveWFjdXRlL3Rob3JuL3lkaWVyZXNpc10+PmVuZG9iago0IDAgb2JqPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvQ291cmllci9FbmNvZGluZyAzIDAgUj4+ZW5kb2JqCjUgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9UaW1lcy1Sb21hbi9FbmNvZGluZyAzIDAgUj4+ZW5kb2JqCjYgMCBvYmo8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcgMyAwIFI+PmVuZG9iago3IDAgb2JqPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhLUJvbGQvRW5jb2RpbmcgMyAwIFI+PmVuZG9iago4IDAgb2JqPDwvVHlwZS9YT2JqZWN0L1N1YnR5cGUvSW1hZ2UvQ29sb3JTcGFjZVsvSW5kZXhlZC9EZXZpY2VSR0IgMTxGMTRDN0IzNEU4NUM+XS9JbnRlcnBvbGF0ZSB0cnVlL0ZpbHRlci9GbGF0ZURlY29kZS9XaWR0aCAxL0hlaWdodCAxL0JpdHNQZXJDb21wb25lbnQgMS9MZW5ndGggOSAgICAgICAgID4+c3RyZWFtColNGDToXOg6E2VuZHN0cmVhbQplbmRvYmoKOSAwIG9iajw8L1R5cGUvWE9iamVjdC9TdWJ0eXBlL0ltYWdlL0NvbG9yU3BhY2VbL0luZGV4ZWQvRGV2aWNlUkdCIDE8N0Q4RTUwNjdBODYwPl0vSW50ZXJwb2xhdGUgdHJ1ZS9GaWx0ZXIvRmxhdGVEZWNvZGUvV2lkdGggMS9IZWlnaHQgMS9CaXRzUGVyQ29tcG9uZW50IDEvTGVuZ3RoIDkgICAgICAgICA+PnN0cmVhbQr6cMxnqGBgtSJlbmRzdHJlYW0KZW5kb2JqCjEwIDAgb2JqPDwvUy9VUkkvVVJJPGM2YmU2Y2ViNjRhNmZkMzU2NzQyYmNiMDAzNzRiZjJkOGQ+Pj5lbmRvYmoKMTEgMCBvYmo8PC9TdWJ0eXBlL0xpbmsvUmVjdFsyOTEuNiAzODcuNyAzMzMuNiAzOTguN10vQm9yZGVyWzAgMCAwXS9BIDEwIDAgUj4+ZW5kb2JqCjEyIDAgb2JqWzExIDAgUl1lbmRvYmoKMTMgMCBvYmo8PC9EZXN0cyAxNCAwIFI+PmVuZG9iagoxNCAwIG9iajw8L0tpZHNbMTUgMCBSXT4+ZW5kb2JqCjE1IDAgb2JqPDwvTGltaXRzWzw2MzcwZTYzZWU1NmU0ZWNiODRhZjNhNTI2NGYxYTEyNzk2M2ViZjg4Pjw2MzcwZTYzZWU1NmU0ZWNiODRhZjNhNTI2NGYxYTEyNzk2M2ViZjg4Pl0vTmFtZXNbPDYzNzBlNjNlZTU2ZTRlY2I4NGFmM2E1MjY0ZjFhMTI3OTYzZWJmODg+MTYgMCBSXT4+ZW5kb2JqCjE2IDAgb2JqPDwvRFsxOCAwIFIvWFlaIDAgNzM0IDBdPj5lbmRvYmoKMTcgMCBvYmo8PC9UeXBlL1BhZ2VzL0NvdW50IDEvS2lkc1sxOCAwIFIKXT4+ZW5kb2JqCjE4IDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAxNyAwIFIvQ29udGVudHMgMTkgMCBSL01lZGlhQm94WzAgMCA1OTUgNzkyXS9SZXNvdXJjZXM8PC9Qcm9jU2V0Wy9QREYvVGV4dC9JbWFnZUIvSW1hZ2VDL0ltYWdlSV0vRm9udDw8L0YwIDQgMCBSL0Y0IDUgMCBSL0Y4IDYgMCBSL0Y5IDcgMCBSPj4vWE9iamVjdDw8L0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBSL0k5IDkgMCBSL0k4IDggMCBS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PDwvUy9EL1N0IDEvUDw+Pj4wPDwvUy9EL1N0IDEvUDw+Pj5dPj4+PmVuZG9iagp4cmVmCjAgMjEgCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMTk5IDAwMDAwIG4gCjAwMDAwMDA0NDMgMDAwMDAgbiAKMDAwMDAwMjAwOSAwMDAwMCBuIAowMDAwMDAyMDgzIDAwMDAwIG4gCjAwMDAwMDIxNjEgMDAwMDAgbiAKMDAwMDAwMjIzNyAwMDAwMCBuIAowMDAwMDAyMzE4IDAwMDAwIG4gCjAwMDAwMDI1MjYgMDAwMDAgbiAKMDAwMDAwMjczNCAwMDAwMCBuIAowMDAwMDAyNzk5IDAwMDAwIG4gCjAwMDAwMDI4ODQgMDAwMDAgbiAKMDAwMDAwMjkwNyAwMDAwMCBuIAowMDAwMDAyOTM5IDAwMDAwIG4gCjAwMDAwMDI5NzEgMDAwMDAgbiAKMDAwMDAwMzEzOSAwMDAwMCBuIAowMDAwMDAzMTgwIDAwMDAwIG4gCjAwMDAwMDMyMzIgMDAwMDAgbiAKMDAwMDAwNTUwOCAwMDAwMCBuIAowMDAwMDA4MDA1IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSAyMS9Sb290IDIwIDAgUi9JbmZvIDIgMCBSL0lEWzw5M2NkOTk5ZDFjOGZmMzQ1NTY1MjBlNjM3NDIyYzlkOT48OTNjZDk5OWQxYzhmZjM0NTU2NTIwZTYzNzQyMmM5ZDk+XS9FbmNyeXB0IDEgMCBSPj4Kc3RhcnR4cmVmCjgxNDcKJSVFT0YK'
    }

    const pdf = await uploadPDF(await dte, 'boletas')

    const file = {
      _id: pdf._id,
      key: pdf.key,
      bucket: pdf.bucket,
      name: pdf.name,
      type: pdf.type,
      size: pdf.size
    }

    console.log({file})

    const ticketsDB = await collection.db()
    const ticket = await ticketsDB.findOne(itemId)
    await ticket.update({$set: {[`data.${params.ticketPdf}`]: file}})
  }
}
