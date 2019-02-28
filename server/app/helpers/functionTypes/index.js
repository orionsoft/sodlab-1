import updateValue from './updateValue'
import updateValueWithIndicator from './updateValueWithIndicator'
import postItem from './postItem'
import signDocumentWithHSM from './signDocumentWithHSM'
import log from './log'
import validationSwitch from './validationSwitch'
import generatePdfFromHTML from './generatePdfFromHTML'
import notifications from './notifications'
import bulkUpload from './bulkUpload'
import mailTo from './mailTo'
import deleteDocument from './deleteDocument'
import sequentialHooks from './sequentialHooks'
import urlToFilemanager from './urlToFilemanager'
import createDocument from './createDocument'
import deleteMultipleDocuments from './deleteMultipleDocuments'
import concatenateValues from './concatenateValues'
import updateMultipleDocuments from './updateMultipleDocuments'
import updateMulitpleDocumentsWithIndicator from './updateMultipleDocumentsWithIndicator'
import batchHooks from './batchHooks'
import dteNotes from './libreDte/hooks/notes'
import dteBills from './libreDte/hooks/bills'
import deliveries from './libreDte/hooks/deliveries'

export default {
  updateValue,
  updateValueWithIndicator,
  updateMultipleDocuments,
  updateMulitpleDocumentsWithIndicator,
  postItem,
  signDocumentWithHSM,
  validationSwitch,
  log,
  generatePdfFromHTML,
  notifications,
  bulkUpload,
  mailTo,
  deleteDocument,
  deleteMultipleDocuments,
  sequentialHooks,
  urlToFilemanager,
  createDocument,
  concatenateValues,
  batchHooks,
  dteNotes,
  dteBills,
  deliveries
}
