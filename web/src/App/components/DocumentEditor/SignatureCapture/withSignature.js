import React from 'react'
import PropTypes from 'prop-types'

function withSignature(Component) {
  return class extends React.Component {
    static propTypes = {
      addSignatureImage: PropTypes.func,
      handleSubmitImg: PropTypes.func
    }
    constructor(props) {
      super(props)
      this.state = {
        helpText: '',
        who: '',
        why: '',
        wgssSignatureSDK: {},
        sigObj: {},
        sigCtl: {},
        dynCapt: {},
        timeout: {},
        bmpObj: '',
        isCaptured: false
      }
    }

    startCapture = () => {
      this.restartSession(this.Capture)
    }

    Exception = txt => {
      this.print('Error: ' + txt)
    }

    print = helpText => {
      if (helpText === 'CLEAR') {
        this.setState({helpText: ''})
      } else {
        this.setState({helpText})
      }
    }

    onLoad = callback => {
      this.print('CLEAR')
      this.restartSession(callback)
    }

    restartSession = callback => {
      let signatureImageBox = document.getElementById('signatureImageBox')
      if (signatureImageBox.firstChild !== null) {
        signatureImageBox.removeChild(signatureImageBox.firstChild)
      }

      let onDetectRunning = () => {
        if (this.state.wgssSignatureSDK.running) {
          // this.print("Signature SDK Service detected.");
          this.print('Dispositivo detectado y listo para firmar')
          clearTimeout(this.state.timeout)
          start()
        } else {
          // this.print("Signature SDK Service not detected.");
          this.print('Dispositivo para firmar o software de firma no encontrado')
        }
      }

      let timedDetect = () => {
        if (this.state.wgssSignatureSDK.running) {
          // this.print("Signature SDK Service detected.");
          this.print('Dispositivo detectado y listo para firmar')
          start()
        } else {
          // this.print("Signature SDK Service not detected.");
          this.print('Dispositivo para firmar o software de firma no encontrado')
        }
      }

      let start = () => {
        if (this.state.wgssSignatureSDK.running) {
          this.setState({
            sigCtl: new this.state.wgssSignatureSDK.SigCtl(onSigCtlConstructor)
          })
        }
      }

      let onSigCtlConstructor = (sigCtlV, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.OK === status) {
          // For production code remove the following line, remove commenting out of
          // PutLicence call and replace 'licence_string' with your licence string
          this.setState({
            dynCapt: new this.state.wgssSignatureSDK.DynamicCapture(onDynCaptConstructor)
          })
          // sigCtl.PutLicence(licence_string, onSigCtlPutLicence);
        } else {
          // this.print("SigCtl constructor error: " + status);
          this.print('Error al iniciar la captura de firma')
        }
      }

      let onDynCaptConstructor = (dynCaptV, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.OK === status) {
          this.state.sigCtl.GetSignature(onGetSignature)
        } else {
          // this.print("DynCapt constructor error: " + status);
          this.print('Error al iniciar la captura de firma')
        }
      }

      let onGetSignature = (sigCtlV, sigObjV, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.OK === status) {
          this.setState({sigObj: sigObjV})
          this.state.sigCtl.GetProperty('Component_FileVersion', onSigCtlGetProperty)
        } else {
          // this.print("SigCapt GetSignature error: " + status);
          this.print('Error al iniciar la captura de firma')
        }
      }

      let onSigCtlGetProperty = (sigCtlV, property, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.OK === status) {
          // this.print("DLL: flSigCOM.dll  v" + property.text);
          this.state.dynCapt.GetProperty('Component_FileVersion', onDynCaptGetProperty)
        } else {
          // this.print("SigCtl GetProperty error: " + status);
          this.print('Error al iniciar la captura de firma')
        }
      }

      let onDynCaptGetProperty = (dynCaptV, property, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.OK === status) {
          // this.print("DLL: flSigCapt.dll v" + property.text);
          // this.print("Test application ready.");
          this.print('Dispositivo listo para capturar la firma.')
          if (typeof callback === 'function') {
            callback()
          }
        } else {
          // this.print("DynCapt GetProperty error: " + status);
          this.print('Error al iniciar la captura de firma')
        }
      }

      this.setState({timeout: setTimeout(timedDetect, 1500)})
      // pass the starting service port  number as configured in the registry
      this.setState({
        wgssSignatureSDK: new window.WacomGSS_SignatureSDK(onDetectRunning, 8000)
      })
      // const onSigCtlPutLicence = (sigCtlV, status) => {
      //   if (wgssSignatureSDK.ResponseStatus.OK === status) {
      //     dynCapt = new wgssSignatureSDK.DynamicCapture(onDynCaptConstructor);
      //   }
      //   else {
      //     this.print("SigCtl constructor error: " + status);
      //   }
      // }
    }

    Capture = () => {
      if (!this.state.wgssSignatureSDK.running || this.state.dynCapt === null) {
        // this.print("Session error. Restarting the session.");
        this.print('Reiniciando software para captura de firma')
        this.restartSession(this.Capture)
        return
      }

      const onDynCaptCapture = (dynCaptV, SigObjV, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.INVALID_SESSION === status) {
          // this.print("Error: invalid session. Restarting the session.");
          this.print('Reiniciando software para captura de firma')
          this.restartSession(this.Capture)
        } else {
          if (this.state.wgssSignatureSDK.DynamicCaptureResult.DynCaptOK !== status) {
            // this.print("Capture returned: " + status);
            this.print('Captura de firma realizada')
          }
          switch (status) {
            case this.state.wgssSignatureSDK.DynamicCaptureResult.DynCaptOK:
              this.setState({sigObj: SigObjV})
              // this.print("Signature captured successfully");
              this.print('Firma captura con exito!')
              const flags =
                this.state.wgssSignatureSDK.RBFlags.RenderOutputBase64 |
                this.state.wgssSignatureSDK.RBFlags.RenderColor32BPP |
                this.state.wgssSignatureSDK.RBFlags.RenderBackgroundTransparent
              const signatureImageBox = document.getElementById('signatureImageBox')
              this.state.sigObj.RenderBitmap(
                'png',
                signatureImageBox.clientWidth,
                signatureImageBox.clientHeight,
                0.7,
                0x00000000,
                0x00ffffff,
                flags,
                0,
                0,
                onRenderBitmapBase64
              )
              break
            case this.state.wgssSignatureSDK.DynamicCaptureResult.DynCaptCancel:
              // this.print("Signature capture cancelled");
              this.print('Captura de firma cancelada')
              break
            case this.state.wgssSignatureSDK.DynamicCaptureResult.DynCaptPadError:
              // this.print("No capture service available");
              this.print('No se ha detectado el software para firmar')
              break
            case this.state.wgssSignatureSDK.DynamicCaptureResult.DynCaptError:
              // this.print("Tablet Error");
              this.print('Error del dispositivo. Por favor, revise la conexión.')
              break
            case this.state.wgssSignatureSDK.DynamicCaptureResult.DynCaptIntegrityKeyInvalid:
              // this.print("The integrity key parameter is invalid (obsolete)");
              this.print('Error al iniciar la aplicación')
              break
            case this.state.wgssSignatureSDK.DynamicCaptureResult.DynCaptNotLicensed:
              // this.print("No valid Signature Capture licence found");
              this.print(
                'Error: no se ha detectado una licencia valida para utilizar el dispositivo'
              )
              break
            case this.state.wgssSignatureSDK.DynamicCaptureResult.DynCaptAbort:
              // this.print("Error - unable to parse document contents");
              this.print('Error: no es posible modificar los contenidos del documento')
              break
            default:
              // this.print("Capture Error " + status);
              this.print('Error en la captura de la firma')
              break
          }
        }
      }
      const who = this.state.who !== '' ? this.state.who : ' '
      const why = this.state.why !== '' ? this.state.why : ' '
      this.state.dynCapt.Capture(this.state.sigCtl, who, why, null, null, onDynCaptCapture)

      const onRenderBitmapBase64 = (sigObjV, bmpObj, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.OK === status) {
          this.setState({bmpObj, isCaptured: true})
          this.print(
            'Firma capturada exitosamente. Presione ACEPTAR para aplicar la firma al documento.'
          )
          let signatureImageBox = document.getElementById('signatureImageBox')
          let img = new Image()
          img.src = 'data:image/png;base64,' + bmpObj
          if (signatureImageBox.firstChild === null) {
            signatureImageBox.appendChild(img)
          } else {
            signatureImageBox.replaceChild(img, signatureImageBox.firstChild)
          }
        } else {
          this.print('Signature Render Bitmap error: ' + status)
        }
      }
    }

    DisplaySignatureDetails = () => {
      if (!this.state.wgssSignatureSDK.running || this.state.sigObj === null) {
        // this.print("Session error. Restarting the session." );
        this.print('Error al iniciar la aplicación para firmar. Reiniciando el servicio.')
        this.restartSession(this.DisplaySignatureDetails)
        return
      }

      const onGetIsCaptured = (sigObj, isCaptured, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.OK === status) {
          if (!isCaptured) {
            // this.print("No signature has been captured yet." );
            this.print('No se ha capturado ninguna firma')
            return
          }
          this.state.sigObj.GetWho(onGetWho)
        } else {
          this.print('Signature GetWho error: ' + status)
          if (this.state.wgssSignatureSDK.ResponseStatus.INVALID_SESSION === status) {
            // this.print("Session error. Restarting the session.");
            this.print('Error al iniciar la aplicación para firmar. Reiniciando el servicio.')
            this.restartSession(this.DisplaySignatureDetails)
          }
        }
      }

      this.state.sigObj.GetIsCaptured(onGetIsCaptured)

      const onGetWho = (sigObjV, who, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.OK === status) {
          // this.print("  Name:   " + who);
          this.print(`Nombre: ${who}`)
          const tz = this.state.wgssSignatureSDK.TimeZone.TimeLocal
          this.state.sigObj.GetWhen(tz, onGetWhen)
        } else {
          // this.print("Signature GetWho error: " + status);
          this.print('No se puede obtener el nombre del firmante.')
        }
      }

      const onGetWhen = (sigObjV, when, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.OK === status) {
          // this.print("  Date:   " + when.toString() );
          this.print(`Fecha: ${when.toString()}`)
          this.state.sigObj.GetWhy(onGetWhy)
        } else {
          // this.print("Signature GetWhen error: " + status);
          this.print('No se puede obtener la fecha de la firma.')
        }
      }

      const onGetWhy = (sigObjV, why, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.OK === status) {
          // this.print("  Reason: " + why);
          this.print(`Razón: ${why}`)
        } else {
          // this.print("Signature GetWhy error: " + status);
          this.print('No se puede obtener la razón de la firma.')
        }
      }
    }

    AboutBox = () => {
      if (!this.state.wgssSignatureSDK.running || this.state.sigCtl === null) {
        // this.print("Session error. Restarting the session.");
        this.print('Error al iniciar la aplicación para firmar. Reiniciando el servicio.')
        this.restartSession(this.AboutBox)
        return
      }

      const onAboutBox = (sigCtlV, status) => {
        if (this.state.wgssSignatureSDK.ResponseStatus.OK !== status) {
          // this.print("AboutBox error: " + status);
          if (this.state.wgssSignatureSDK.ResponseStatus.INVALID_SESSION === status) {
            // this.print("Session error. Restarting the session.");
            this.print('Error al iniciar la aplicación para firmar. Reiniciando el servicio.')
            this.restartSession(this.AboutBox)
          }
        }
      }
      this.state.sigCtl.AboutBox(onAboutBox)
    }

    handleSubmitSignature = (complete_name, rut) => {
      this.props.addSignatureImage(
        `${rut}.signature`,
        'data:image/png;base64,' + this.state.bmpObj,
        complete_name,
        rut,
        () => this.props.handleSubmitImg()
      )
    }

    handleWhoChange = (value, callback) => this.setState({who: value}, () => callback())

    handleWhyChange = (value, callback) => this.setState({why: value}, () => callback())

    render() {
      return (
        <Component
          signatureState={this.state}
          isCaptured={this.state.isCaptured}
          handleWhoChange={this.handleWhoChange}
          handleWhyChange={this.handleWhyChange}
          startCapture={this.startCapture}
          handleSubmitSignature={this.handleSubmitSignature}
          {...this.props}
        />
      )
    }
  }
}

export default withSignature
