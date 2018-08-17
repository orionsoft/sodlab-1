import React from 'react'
import PropTypes from 'prop-types'

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const IntercomAPI = (...args) => {
  if (canUseDOM && window.Intercom) {
    window.Intercom.apply(null, args)
  } else {
    console.warn('Intercom not initialized yet')
  }
}

export default class Intercom extends React.Component {
  static propTypes = {
    intercomId: PropTypes.string,
    email: PropTypes.string
  }

  state = {}

  static displayName = 'Intercom'

  loadIntercom(email, intercomId, otherProps) {
    if (!canUseDOM) {
      return
    }
    if (!window.Intercom) {
      ;(function(w, d, id, s, x) {
        function i() {
          i.c(arguments)
        }
        i.q = []
        i.c = function(args) {
          i.q.push(args)
        }
        w.Intercom = i
        s = d.createElement('script')
        s.async = 1
        s.src = 'https://widget.intercom.io/widget/' + id
        d.head.appendChild(s)
      })(window, document, intercomId)
    }
    window.intercomSettings = {
      ...otherProps,
      app_id: intercomId,
      email
    }
    if (window.Intercom) {
      window.Intercom('boot', otherProps)
    }
  }

  componentDidMount() {
    const {email, intercomId, ...otherProps} = this.props
    this.setState({email, intercomId, otherProps})
  }

  static getDerivedStateFromProps(props, state) {
    const {email, intercomId, ...otherProps} = props
    this.loadIntercom(email, intercomId, otherProps)
  }

  componentWillUnmount() {
    if (!canUseDOM || !window.Intercom) return false
    window.Intercom('shutdown')
    delete window.Intercom
  }

  render() {
    console.log(this.props)
    return false
  }
}
